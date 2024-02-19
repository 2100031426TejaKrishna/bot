const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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

router.get('/fetchQuestions', async (req, res) => {
    try {
        const questions = await fetchQuestions();
        res.json(questions);
    } catch (error) {
        res.status(500).send("Unable to fetch all questions");
    }
});

module.exports = { fetchQuestions, router };