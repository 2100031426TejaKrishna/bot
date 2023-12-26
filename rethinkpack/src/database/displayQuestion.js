const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');

const fetchQuestions = async () => {
    try {
        const questions = await Questions.find({});
        console.log(questions);
        return questions;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
}

router.get('/displayQuestions', async (req, res) => {
    try {
        const questions = await fetchQuestions();
        res.json(questions);
    } catch (error) {
        res.status(500).send("Unable to fetch questions");
    }
});

router.get('/displayAllQuestions', async (req, res) => {
    try {
        const questions = await fetchQuestions();
        res.json(questions.map(q => ({ _id: q._id, question: q.question })));
    } catch (error) {
        res.status(500).send("Unable to fetch questions");
    }
});

router.get('/question/:id', async (req, res) => {
    try {
        const question = await Questions.findById(req.params.id);
        if (!question) {
            return res.status(404).send("Question not found");
        }
        res.json(question);
    } catch (error) {
        console.error("Error fetching specific question:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/option/:optionId', async (req, res) => {
    try {
        const questions = await Questions.find({});
        let optionDetail = null;
        for (const question of questions) {
            const foundOption = question.options.find(option => option._id.toString() === req.params.optionId);
            if (foundOption) {
                optionDetail = foundOption;
                break;
            }
        }

        if (!optionDetail) {
            return res.status(404).send("Option not found");
        }

        res.json(optionDetail);
    } catch (error) {
        console.error("Error fetching specific option:", error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = { router, fetchQuestions };