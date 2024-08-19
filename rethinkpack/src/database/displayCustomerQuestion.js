const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Titles = mongoose.model('titles');
const Questions = mongoose.model('questions');

// Helper function to fetch a question by its ID
const fetchQuestionById = async (questionId) => {
    try {
        const question = await Questions.findById(questionId);
        return question;
    } catch (error) {
        console.error("Error fetching question by ID:", error);
        throw error;
    }
};


// Recursive function to gather all related questions in a series
// Recursive function to gather all related questions in a series
// Recursive function to gather all related questions in a series
const gatherSeriesQuestions = async (questionId, seriesSet = new Set(), nextQuestionQueue = [], visitedQuestions = new Map(), mainQuestionId = null) => {
    console.log(`Fetching question with ID: ${questionId}`);
    const question = await fetchQuestionById(questionId);
    if (!question) {
        console.log(`Question with ID ${questionId} not found.`);
        return;
    }
    if (seriesSet.has(questionId.toString())) {
        console.log(`Question with ID ${questionId} already processed.`);
        return;
    }

    seriesSet.add(questionId.toString());
    visitedQuestions.set(questionId.toString(), question);
    console.log(`Added question with ID ${questionId} to seriesSet and visitedQuestions.`);

    let hasOptionsNextQuestion = false;

    if (question.options && question.options.length > 0) {
        question.options.forEach(option => {
            if (option.optionsNextQuestion) {
                console.log(`Found optionsNextQuestion with ID ${option.optionsNextQuestion} for option in question ${questionId}`);
                nextQuestionQueue.push(option.optionsNextQuestion);
                hasOptionsNextQuestion = true;
            }
        });
    }

    if (!hasOptionsNextQuestion && mainQuestionId === null) {
        mainQuestionId = questionId;
    }

    if (nextQuestionQueue.length === 0 && !hasOptionsNextQuestion && mainQuestionId !== null) {
        const mainQuestion = await fetchQuestionById(mainQuestionId);
        if (mainQuestion && mainQuestion.nextQuestion && !seriesSet.has(mainQuestion.nextQuestion.toString())) {
            console.log(`No optionsNextQuestion found, adding nextQuestion with ID ${mainQuestion.nextQuestion} for main question ${mainQuestionId}`);
            nextQuestionQueue.push(mainQuestion.nextQuestion);
        }
    }

    while (nextQuestionQueue.length > 0) {
        const nextId = nextQuestionQueue.shift();
        console.log(`Processing next question in the queue with ID ${nextId}`);
        await gatherSeriesQuestions(nextId, seriesSet, nextQuestionQueue, visitedQuestions, mainQuestionId);
    }
};



const fetchAllQuestions = async () => {
    try {
        console.log("Fetching all questions from the database.");
        const allQuestions = await Questions.find({});
        const referencedQuestionIds = new Set();
        const seriesSet = new Set();
        const nextQuestionQueue = [];
        const visitedQuestions = new Map();

        allQuestions.forEach(question => {
            question.options?.forEach(option => {
                if (option.optionsNextQuestion) {
                    referencedQuestionIds.add(option.optionsNextQuestion.toString());
                    console.log(`Referenced question ID ${option.optionsNextQuestion} found in options of question ${question._id}`);
                }
            });
        });

        console.log("Gathering series questions for independent questions.");
        for (const question of allQuestions) {
            if (!referencedQuestionIds.has(question._id.toString())) {
                console.log(`Question with ID ${question._id} is an independent question.`);
                await gatherSeriesQuestions(question._id, seriesSet, nextQuestionQueue, visitedQuestions);
            }
        }

        console.log("Fetching series questions from the database.");
        const seriesQuestions = await Questions.find({
            '_id': { $in: Array.from(seriesSet) },
        });

        return { independentQuestions: Array.from(visitedQuestions.values()), seriesQuestions };
    } catch (error) {
        console.error("Error fetching all questions:", error);
        throw error;
    }
};


router.get('/fetchAllQuestions', async (req, res) => {
    try {
        const allQuestions = await Questions.find({});
        res.json(allQuestions);
    } catch (error) {
        console.error("Error fetching all questions:", error);
        res.status(500).send("Server error");
    }
});

router.get('/fetchQuestionsSeries', async (req, res) => {
    try {
        const { independentQuestions, seriesQuestions } = await fetchAllQuestions();
        res.json({ independentQuestions, seriesQuestions });
    } catch (error) {
        res.status(500).send("Unable to fetch questions series");
    }
});

router.get('/fetchQuestionById/:questionId', async (req, res) => {
    const { questionId } = req.params;

    try {
        const question = await fetchQuestionById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.json(question);
    } catch (error) {
        res.status(500).send("Unable to fetch question by ID");
    }
});

const fetchQuestionsByCountries = async (selectedCountries) => {
    try {
        const countrySpecificQuestions = await Questions.find({
            $or: [
                { "country.selectedCountry": { $in: selectedCountries } },
                { "countries": { $in: selectedCountries } }
            ]
        }).select('question optionType options');

        const firstQuestions = countrySpecificQuestions.filter(question => question.country.countryFirstQuestion);
        const otherQuestions = countrySpecificQuestions.filter(question => !question.country.countryFirstQuestion);

        const orderedQuestions = [...firstQuestions, ...otherQuestions];

        return orderedQuestions;
    } catch (error) {
        console.error("Error fetching questions by countries:", error);
        throw error;
    }
};

router.post('/fetchQuestionsByCountries', async (req, res) => {
    const { countries } = req.body;

    if (!countries || !countries.length) {
        return res.status(400).json({ message: "No countries provided" });
    }

    try {
        const questions = await fetchQuestionsByCountries(countries);
        console.log("Questions for countries:", questions);
        res.json(questions);
    } catch (error) {
        res.status(500).send("Unable to fetch questions by selected countries");
    }
});

router.get('/fetchTitleForQuestion/:questionId', async (req, res) => {
    const { questionId } = req.params;

    try {
        const question = await Questions.findById(questionId);
        if (!question) {
            console.error(`Question with ID ${questionId} not found`);
            return res.status(404).json({ message: "Question not found" });
        }

        const { titleId } = question;
        console.log(`Title ID: ${titleId}`);

        let titleInfo = null;
        let subtitleInfo = null;
        let nestedTitleInfo = null;
        let subNestedTitleInfo = null;

        const titles = await Titles.find().exec();
        console.log(`Fetched ${titles.length} titles`);

        const findTitleInfo = (title, titleId) => {
            console.log(`Checking title: ${title.title.titleLabel}`);
            if (title?.title?._id?.toString() === titleId) {
                console.log(`Match found at title level: ${title.title.titleLabel}`);
                return {
                    titleInfo: title.title.titleLabel,
                    subtitleInfo: null,
                    nestedTitleInfo: null,
                    subNestedTitleInfo: null
                };
            }
            for (const subtitle of title.title?.subTitle || []) {
                console.log(`Checking subtitle: ${subtitle.subTitleLabel}`);
                if (subtitle?._id?.toString() === titleId) {
                    console.log(`Match found at subtitle level: ${subtitle.subTitleLabel}`);
                    return {
                        titleInfo: title.title.titleLabel,
                        subtitleInfo: subtitle.subTitleLabel,
                        nestedTitleInfo: null,
                        subNestedTitleInfo: null
                    };
                }
                for (const nestedTitle of subtitle?.nestedTitle || []) {
                    console.log(`Checking nested title: ${nestedTitle.nestedTitleLabel}`);
                    if (nestedTitle?._id?.toString() === titleId) {
                        console.log(`Match found at nested title level: ${nestedTitle.nestedTitleLabel}`);
                        return {
                            titleInfo: title.title.titleLabel,
                            subtitleInfo: subtitle.subTitleLabel,
                            nestedTitleInfo: nestedTitle.nestedTitleLabel,
                            subNestedTitleInfo: null
                        };
                    }
                    if (nestedTitle?.subNestedTitle) {
                        console.log(`Checking sub-nested titles in nested title: ${nestedTitle.nestedTitleLabel}`);
                        for (const subNestedTitle of nestedTitle?.subNestedTitle || []) {
                            console.log(`Checking sub-nested title: ${subNestedTitle.subNestedTitleLabel}`);
                            if (subNestedTitle?._id?.toString() === titleId) {
                                console.log(`Match found at sub-nested title level: ${subNestedTitle.subNestedTitleLabel}`);
                                return {
                                    titleInfo: title.title.titleLabel,
                                    subtitleInfo: subtitle.subTitleLabel,
                                    nestedTitleInfo: nestedTitle.nestedTitleLabel,
                                    subNestedTitleInfo: subNestedTitle.subNestedTitleLabel
                                };
                            }
                        }
                    }
                }
            }
            return null;
        };

        let found = false;
        for (const title of titles) {
            const result = findTitleInfo(title, titleId);
            if (result) {
                titleInfo = result.titleInfo;
                subtitleInfo = result.subtitleInfo;
                nestedTitleInfo = result.nestedTitleInfo;
                subNestedTitleInfo = result.subNestedTitleInfo;
                found = true;
                break;
            }
        }

        if (!found) {
            console.error(`Title information not found for title ID: ${titleId}`);
            return res.status(404).json({ message: "Title information not found" });
        }

        res.json({ title: titleInfo, subtitle: subtitleInfo, nestedTitle: nestedTitleInfo, subNestedTitle: subNestedTitleInfo });
    } catch (error) {
        console.error("Error fetching title for question:", error);
        res.status(500).json({ message: "Error fetching title information" });
    }
});




router.get('/fetchQuestionsDetails', async (req, res) => {
    try {
        const titles = await Titles.find().sort({ date: -1 });

        let titlesDetails = await Promise.all(titles.map(async (title) => {
            return {
                title: title.title.titleLabel,
                dateCreated: title.date,
                subtitles: await Promise.all(title.title.subTitle.map(async (sub) => {
                    const subTitleId = sub._id.toString();
                    let queue = [];
                    let allQuestions = new Map();

                    let firstSubTitleQuestion = await Questions.findOne({
                        'subTitle.id': subTitleId,
                        'subTitle.firstQuestion': true
                    });
                    
                    if (firstSubTitleQuestion) {
                        queue.push(firstSubTitleQuestion);
                    }

                    while (queue.length > 0) {
                        let currentQuestion = queue.shift();
                        allQuestions.set(currentQuestion._id.toString(), currentQuestion);

                        if (currentQuestion.nextQuestion) {
                            let nextQuestionId = new mongoose.Types.ObjectId(currentQuestion.nextQuestion);
                            if (!allQuestions.has(nextQuestionId.toString())) {
                                let nextQuestion = await Questions.findById(nextQuestionId);
                                if (nextQuestion) {
                                    queue.push(nextQuestion);
                                }
                            }
                        }

                        if (currentQuestion.options && currentQuestion.options.length > 0) {
                            for (let option of currentQuestion.options) {
                                if (option.optionsNextQuestion) {
                                    let optionNextQuestionId = new mongoose.Types.ObjectId(option.optionsNextQuestion);
                                    if (!allQuestions.has(optionNextQuestionId.toString())) {
                                        let nextQuestion = await Questions.findById(optionNextQuestionId);
                                        if (nextQuestion) {
                                            queue.push(nextQuestion);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    let questionsArray = Array.from(allQuestions.values());

                    const nestedTitles = await Promise.all(sub.nestedTitle.map(async (nested) => {
                        const nestedTitleId = nested._id.toString();

                        let nestedQueue = [];
                        let nestedAllQuestions = new Map();

                        let firstNestedTitleQuestion = await Questions.findOne({
                            'nestedTitle.id': nestedTitleId,
                            'nestedTitle.firstQuestion': true
                        });

                        if (firstNestedTitleQuestion) {
                            nestedQueue.push(firstNestedTitleQuestion);
                        }

                        while (nestedQueue.length > 0) {
                            let currentQuestion = nestedQueue.shift();
                            nestedAllQuestions.set(currentQuestion._id.toString(), currentQuestion);

                            if (currentQuestion.nextQuestion) {
                                let nextQuestionId = new mongoose.Types.ObjectId(currentQuestion.nextQuestion);
                                if (!nestedAllQuestions.has(nextQuestionId.toString())) {
                                    let nextQuestion = await Questions.findById(nextQuestionId);
                                    if (nextQuestion) {
                                        nestedQueue.push(nextQuestion);
                                    }
                                }
                            }

                            if (currentQuestion.options && currentQuestion.options.length > 0) {
                                for (let option of currentQuestion.options) {
                                    if (option.optionsNextQuestion) {
                                        let optionNextQuestionId = new mongoose.Types.ObjectId(option.optionsNextQuestion);
                                        if (!nestedAllQuestions.has(optionNextQuestionId.toString())) {
                                            let nextQuestion = await Questions.findById(optionNextQuestionId);
                                            if (nextQuestion) {
                                                nestedQueue.push(nextQuestion);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        let nestedQuestionsArray = Array.from(nestedAllQuestions.values());

                        return {
                            nestedTitleLabel: nested.nestedTitleLabel,
                            questions: nestedQuestionsArray
                        };
                    }));

                    return {
                        subtitleLabel: sub.subTitleLabel,
                        questions: questionsArray,
                        nestedTitles: nestedTitles
                    };
                }))
            };
        }));

        res.json(titlesDetails);
    } catch (error) {
        console.error("Error fetching titles with details:", error);
        res.status(500).json({ message: "Error fetching title information" });
    }
});

module.exports = router;