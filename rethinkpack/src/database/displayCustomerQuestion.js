const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Titles = mongoose.model('titles');
const Questions = mongoose.model('questions');

const fetchQuestions = async () => {
    try {
        let allQuestions = new Map();
        let queue = [];
        let firstQuestion = await Questions.findOne({ firstQuestion: true });
        if (firstQuestion) {
            queue.push(firstQuestion);
        }

        while (queue.length > 0) {
            let currentQuestion = queue.shift();
            allQuestions.set(currentQuestion._id.toString(), currentQuestion);

            // // Fetch the title, sub-title, and nested title label
            // const title = await Titles.findOne({ "title.subTitle.nestedTitle._id": currentQuestion.titleId });
            // if (title) {
            //     currentQuestion.titleInfo = {
            //         title: title.title.titleLabel,
            //         subTitle: title.title.subTitle.map(sub => sub.subTitleLabel),
            //         nestedTitle: title.title.subTitle.map(sub => sub.nestedTitle.map(nested => nested.nestedTitleLabel))
            //     };
            //     console.log("Title:", currentQuestion.titleInfo.title);
            //     console.log("Sub Title:", currentQuestion.titleInfo.subTitle);
            //     console.log("Nested Title:", currentQuestion.titleInfo.nestedTitle);
            // } else {
            //     console.log('Title not found for question:', currentQuestion._id);
            // }

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
        const questions = await Questions.find({
            countries: { $in: selectedCountries }
        });

        return questions;
    } catch (error) {
        console.error("Error fetching questions by countries:", error);
        throw error;
    }
};

const fetchTitleDetailsForQuestion = async (nestedTitleId) => {
    try {
        const result = await Titles.aggregate([
            {
                $unwind: '$subTitle'
            },
            {
                $unwind: '$subTitle.nestedTitle'
            },
            {
                $match: { 'subTitle.nestedTitle._id': mongoose.Types.ObjectId(nestedTitleId) }
            },
            {
                $project: {
                    _id: 0,
                    titleLabel: '$title.titleLabel',
                    subTitleLabel: '$subTitle.subTitleLabel',
                    nestedTitleLabel: '$subTitle.nestedTitle.nestedTitleLabel'
                }
            }
        ]);

        if (result.length > 0) {
            return result[0]; // Assuming the nestedTitleId is unique, there should only be one match.
        } else {
            console.error("No matching title details found for the given nestedTitleId");
            return null;
        }
    } catch (error) {
        console.error("Error fetching title details for question:", error);
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

router.get('/questionTitleDetails/:nestedTitleId', async (req, res) => {
    const { nestedTitleId } = req.params;
    try {
        const titleDetails = await fetchTitleDetailsForQuestion(nestedTitleId);
        if (titleDetails) {
            res.json(titleDetails);
        } else {
            res.status(404).send("Title details not found for the specified question");
        }
    } catch (error) {
        console.error("Error in /questionTitleDetails route:", error);
        res.status(500).send("Server error while fetching title details");
    }
});

module.exports = router;