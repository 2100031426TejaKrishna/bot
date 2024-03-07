const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');

// Function to fetch questions by titleId
const fetchQuestionsByTitleId = async (titleId) => {
    try {
        // Use mongoose query to find questions by titleId
        const questions = await Questions.find({ titleId });
        return questions;
    } catch (error) {
        console.error("Error fetching questions by titleId:", error);
        throw error;
    }
}

// Route to fetch questions by titleId
router.get('/questionsByTitleId/:titleId', async (req, res) => {
    try {
        const { titleId } = req.params;
        const questions = await fetchQuestionsByTitleId(titleId);
        res.json(questions);
    } catch (error) {
        console.error("Error fetching questions by titleId:", error);
        res.status(500).send("Unable to fetch questions by titleId");
    }
});

// Function to fetch questions by SubtitleId
const fetchQuestionsBySubtitleId = async (titleId) => {
    try {
        // Use mongoose query to find questions by SubtitleId
        const questions = await Questions.find({ titleId });
        return questions;
    } catch (error) {
        console.error("Error fetching questions by SubtitleId:", error);
        throw error;
    }
}

// Route to fetch questions by titleId
router.get('/questionsBySubtitleId/:titleId', async (req, res) => {
    try {
        const { titleId } = req.params;
        const questions = await fetchQuestionsBySubtitleId(titleId);
        res.json(questions);
    } catch (error) {
        console.error("Error fetching questions by SubtitleId:", error);
        res.status(500).send("Unable to fetch questions by SubtitleId");
    }
});

// Function to fetch questions by NestedtitleId
const fetchQuestionsByNestedtitleId = async (titleId) => {
    try {
        // Use mongoose query to find questions by NestedtitleId
        const questions = await Questions.find({ titleId });
        return questions;
    } catch (error) {
        console.error("Error fetching questions by NestedtitleId:", error);
        throw error;
    }
}

// Route to fetch questions by NestedtitleId
router.get('/questionsByNestedtitleId/:titleId', async (req, res) => {
    try {
        const { titleId } = req.params;
        const questions = await fetchQuestionsByNestedtitleId(titleId);
        res.json(questions);
    } catch (error) {
        console.error("Error fetching questions by NestedtitleId:", error);
        res.status(500).send("Unable to fetch questions by NestedtitleId");
    }
});

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
        res.json(questions.map(q => ({ 
            _id: q._id, 
            question: q.question, 
            firstQuestion: q.firstQuestion, 
            titleId: q.titleId,
            country: q.country
        })));
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

module.exports = router;