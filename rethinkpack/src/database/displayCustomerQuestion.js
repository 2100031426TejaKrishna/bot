const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Titles = mongoose.model('titles');
const Questions = mongoose.model('questions');

const fetchTitleDetails = async (titleId) => {
    try {
        const title = await Titles.findById(titleId);
        return title;
    } catch (error) {
        console.error("Error fetching title details:", error);
        throw error;
    }
};

const fetchQuestions = async () => {
    try {
        let allQuestions = new Map();
        let queue = [];
        let firstQuestion = await Questions.findOne({ firstQuestion: true });
        if (firstQuestion) {
            const titleDetails = await fetchTitleDetails(firstQuestion.titleId);
            firstQuestion = { ...firstQuestion._doc, titleDetails };
            queue.push(firstQuestion);
        }

        while (queue.length > 0) {
            let currentQuestion = queue.shift();
            allQuestions.set(currentQuestion._id.toString(), currentQuestion);

            // Function to handle adding next questions to the queue
            const addNextQuestionToQueue = async (nextQuestionId) => {
                if (!allQuestions.has(nextQuestionId.toString())) {
                    let nextQuestion = await Questions.findById(nextQuestionId);
                    if (nextQuestion) {
                        queue.push(nextQuestion);
                    }
                }
            };

            // Check and enqueue the nextQuestion if not already processed
            if (currentQuestion.nextQuestion) {
                let nextQuestionId = new mongoose.Types.ObjectId(currentQuestion.nextQuestion);
                await addNextQuestionToQueue(nextQuestionId);
            }
                
            // Process options and their nextQuestions
            if (currentQuestion.options && currentQuestion.options.length > 0) {
                for (let option of currentQuestion.options) {
                    if (option.optionsNextQuestion) {
                        let optionNextQuestionId = new mongoose.Types.ObjectId(option.optionsNextQuestion);
                        await addNextQuestionToQueue(optionNextQuestionId);
                    }
                }
            }
        }

        return Array.from(allQuestions.values());
    } catch (error) {
        console.error("Error fetching all questions:", error);
        throw error;
    }
};

const fetchQuestionsByCountries = async (selectedCountries) => {
    try {
        // Find questions related to the selected countries
        const countrySpecificQuestions = await Questions.find({
            "country.selectedCountry": { $in: selectedCountries }
        });

        // Prioritize questions where countryFirstQuestion is true
        const firstQuestions = countrySpecificQuestions.filter(question => question.country.countryFirstQuestion);
        const otherQuestions = countrySpecificQuestions.filter(question => !question.country.countryFirstQuestion);

        // Concatenate the two arrays, ensuring firstQuestions come first
        const orderedQuestions = [...firstQuestions, ...otherQuestions];

        return orderedQuestions;
    } catch (error) {
        console.error("Error fetching questions by countries:", error);
        throw error;
    }
};

router.get('/fetchQuestions', async (req, res) => {
    try {
        const questions = await fetchQuestions();
        res.json(questions);
    } catch (error) {
        res.status(500).send("Unable to fetch all questions");
    }
});

router.post('/selectedCountries', async (req, res) => {
    const { countries } = req.body; 
    try {
        console.log('Selected countries:', countries); 

        res.status(200).json({ message: 'Selected countries received and processed' });
    } catch (error) {
        console.error("Error processing selected countries:", error);
        res.status(500).json({ message: "Error processing selected countries" });
    }
});

router.post('/fetchQuestionsByCountries', async (req, res) => {
    const { countries } = req.body;

    if (!countries || !countries.length) {
        return res.status(400).json({ message: "No countries provided" });
    }

    try {
        const questions = await fetchQuestionsByCountries(countries);
        console.log("Questions for country:", questions);
        res.json(questions);
    } catch (error) {
        res.status(500).send("Unable to fetch questions by selected countries");
    }
});

router.get('/fetchTitleForQuestion/:questionId', async (req, res) => {
    const { questionId } = req.params;

    try {
        // Fetch the question using the provided ID
        const question = await Questions.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Extract the titleId from the question
        const { titleId } = question;

        // Initialize variables to hold the title information
        let titleInfo = null;
        let subtitleInfo = null;
        let nestedTitleInfo = null;

        // Fetch all titles and iterate to find the matching nested title ID
        const titles = await Titles.find();
        for (let title of titles) {
            for (let subtitle of title.title.subTitle) {
                for (let nestedTitle of subtitle.nestedTitle) {
                    if (nestedTitle._id.toString() === titleId) {
                        // Once found, set the title, subtitle, and nested title information
                        titleInfo = title.title.titleLabel;
                        subtitleInfo = subtitle.subTitleLabel;
                        nestedTitleInfo = nestedTitle.nestedTitleLabel;
                        break;
                    }
                }
                if (nestedTitleInfo) break;
            }
            if (nestedTitleInfo) break;
        }

        if (!nestedTitleInfo) {
            return res.status(404).json({ message: "Title information not found" });
        }

        // Respond with the found title information
        res.json({ title: titleInfo, subtitle: subtitleInfo, nestedTitle: nestedTitleInfo });
    } catch (error) {
        console.error("Error fetching title for question:", error);
        res.status(500).json({ message: "Error fetching title information" });
    }
});

router.get('/fetchTitlesWithDetails', async (req, res) => {
    try {
        const titles = await Titles.find().sort({date: -1});

        let titlesDetails = await Promise.all(titles.map(async (title) => {
            return {
                title: title.title.titleLabel,
                dateCreated: title.date,
                subtitles: await Promise.all(title.title.subTitle.map(async (sub) => {
                    return {
                        subtitleLabel: sub.subTitleLabel,
                        nestedTitles: await Promise.all(sub.nestedTitle.map(async (nested) => {
                            // Ensure to convert _id to string format if needed before comparison
                            const nestedTitleId = nested._id.toString(); // Converting MongoDB ObjectID to string if not already

                            // Attempt to find the first question for the nested title
                            const question = await Questions.findOne({
                                'nestedTitle.id': nestedTitleId, // Make sure this matches correctly, considering the data types
                                'nestedTitle.firstQuestion': true
                            });

                            let nestedTitleDetail = {
                                nestedTitleLabel: nested.nestedTitleLabel,
                                // Only add the question text if a question was found
                                ...(question && { question })
                            };

                            return nestedTitleDetail;
                        }))
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