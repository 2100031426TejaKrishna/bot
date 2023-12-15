const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const questionSchema = new mongoose.Schema({
    questionType: String,
    question: String,
    optionType: String,
    options: [{
        text: String,
        isCorrect: Boolean
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
        text: String,
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
Questions.createIndexes();

router.post('/insertQuestion', async (req, res) => {
    try {
        let questionData = req.body;

        if (questionData.isLeadingQuestion) {
            questionData.recommendation = questionData.explanation;
            delete questionData.explanation;
            delete questionData.mark;
        }

        if (!questionData.showCountry) {
            delete questionData.countries;
        }

        if (questionData.optionType === 'linear') {
            delete questionData.options;
        } else {
            delete questionData.linearScale;
        }

        if (questionData.optionType === 'multipleChoiceGrid' || questionData.optionType === 'checkboxGrid') {
            delete questionData.options;
            delete questionData.linearScale;
        } else {
            delete questionData.grid;
            delete questionData.requireResponse;
        }
        
        questionData.date = new Date();
        console.log(questionData);

        const question = new Questions(questionData);
        let result = await question.save();
        result = result.toObject();
        console.log(result);

        res.send(questionData);
    } catch (error) {
        console.error("Error inserting question:", error);
        res.status(500).send("Something Went Wrong");
    }
});

module.exports = router;
