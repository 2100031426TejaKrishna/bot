const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');

const fetchQuestions = async () => {
    try {
        // const questions = await Questions.find({}).sort({ _id: 1 });
        const questions = await Questions.find({ firstQuestion: true });
        console.log(questions);
        return questions;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
}

router.get('/displayQuestionsCustomer', async (req, res) => {
    try {
        const questions = await fetchQuestions();
        res.json(questions);
    } catch (error) {
        res.status(500).send("Unable to fetch questions");
    }
});

const fetchFirstQuestion = async () => {
    try {
        const question = await Questions.findOne({ firstQuestion: true });
        return question;
    } catch (error) {
        console.error("Error fetching the first question:", error);
        throw error;
    }
};

const fetchNextQuestion = async (nextQuestionId) => {
    try {
        const question = await Questions.findById(nextQuestionId);
        return question;
    } catch (error) {
        console.error("Error fetching the next question:", error);
        throw error;
    }
};

router.get('/firstQuestion', async (req, res) => {
    try {
        const question = await fetchFirstQuestion();
        res.json(question);
    } catch (error) {
        res.status(500).send("Unable to fetch the first question");
    }
});

router.get('/nextQuestion/:id', async (req, res) => {
    try {
        const question = await fetchNextQuestion(req.params.id);
        res.json(question);
    } catch (error) {
        res.status(500).send("Unable to fetch the next question");
    }
});

module.exports = router;