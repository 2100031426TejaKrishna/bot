const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');

const fetchQuestions = async (selectedCountries = []) => {
    try {
        let allQuestions = new Map();
        let queue = [];
        let firstQuestion = await Questions.findOne({ firstQuestion: true });
        if (firstQuestion) {
            queue.push(firstQuestion);
        }

        while (queue.length > 0) {
            let currentQuestion = queue.shift();
            // Filter based on selected countries
            if (currentQuestion.countries.length === 0 || currentQuestion.countries.some(country => selectedCountries.includes(country))) {
                allQuestions.set(currentQuestion._id.toString(), currentQuestion);

                const addNextQuestionToQueue = async (nextQuestionId) => {
                    if (!allQuestions.has(nextQuestionId.toString())) {
                        let nextQuestion = await Questions.findById(nextQuestionId);
                        if (nextQuestion) {
                            queue.push(nextQuestion);
                        }
                    }
                };

                if (currentQuestion.nextQuestion) {
                    await addNextQuestionToQueue(currentQuestion.nextQuestion);
                }

                if (currentQuestion.options && currentQuestion.options.length > 0) {
                    for (let option of currentQuestion.options) {
                        if (option.optionsNextQuestion) {
                            await addNextQuestionToQueue(option.optionsNextQuestion);
                        }
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

router.get('/fetchQuestions', async (req, res) => {
    try {
        const selectedCountries = req.query.countries ? req.query.countries.split(',') : [];
        const questions = await fetchQuestions(selectedCountries);
        res.json(questions);
    } catch (error) {
        res.status(500).send("Unable to fetch all questions");
    }
});

module.exports = router;