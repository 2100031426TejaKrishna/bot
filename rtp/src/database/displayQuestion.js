const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionType: String,
    question: String,
    optionType: String,
    options: [{
        text: String,
        isCorrect: Boolean,
        optionsNextQuestion: String
    }],
    linearScale: [{
        scale: Number,
        label: String
    }],
    grid: {
        rows: [{
            text: String,
        }],
        columns: [{
            text: String
        }],
        answers: [{
            rowIndex: Number,
            columnIndex: Number,
            isCorrect: Boolean
        }]
    },
    requireResponse: Boolean,  
    marks: Number,
    countries: [String],
    explanation: String,
    recommendation: String,
    nextQuestion: String,
    date: {
        type: Date,
        default: Date.now,
    },
});

const Questions = mongoose.model('questions', questionSchema);

// This function fetches all questions
const fetchQuestions = async () => {
    try {
        const questions = await Questions.find({}).sort({ _id: 1 });
        console.log(questions);
        return questions;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
}

// Endpoint for the customer site to fetch questions
router.get('/displayQuestions', async (req, res) => {
    try {
        const questions = await fetchQuestions();
        res.json(questions);
    } catch (error) {
        res.status(500).send("Unable to fetch questions");
    }
});

module.exports = { router, fetchQuestions };