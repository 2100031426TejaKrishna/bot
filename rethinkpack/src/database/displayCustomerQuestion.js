const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');
// const Titles = mongoose.model('titles');

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
            // Fetch title information
            // if (currentQuestion.titleId) {
            //     let titleInfo = await Titles.findById(currentQuestion.titleId).lean();
            //     currentQuestion.titleInfo = titleInfo; // Add title info to the question object
            // }
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
        const questions = await Questions.find({
            countries: { $in: selectedCountries }
        });

        return questions;
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

module.exports = router;