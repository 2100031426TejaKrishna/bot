const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');

// const fetchQuestions = async () => {
//     try {
//         // const questions = await Questions.find({}).sort({ _id: 1 });
//         const questions = await Questions.find({ firstQuestion: true });
//         console.log(questions);
//         return questions;
//     } catch (error) {
//         console.error("Error fetching questions:", error);
//         throw error;
//     }
// }

// router.get('/displayQuestionsCustomer', async (req, res) => {
//     try {
//         const questions = await fetchQuestions();
//         res.json(questions);
//     } catch (error) {
//         res.status(500).send("Unable to fetch questions");
//     }
// });

const fetchQuestions = async () => {
    try {
        let allQuestions = [];
        let currentQuestion = await Questions.findOne({ firstQuestion: true });

        while (currentQuestion) {
            allQuestions.push(currentQuestion);
            if (currentQuestion.nextQuestion) {
                const nextQuestionId = new mongoose.Types.ObjectId(currentQuestion.nextQuestion);
                currentQuestion = await Questions.findById(nextQuestionId);
            } else {
                currentQuestion = null;
            }
        }

        return allQuestions;
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

module.exports = router;