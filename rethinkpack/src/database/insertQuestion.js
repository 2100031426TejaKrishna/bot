const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const questionSchema = new mongoose.Schema({
    titleId: String,
    question: String,
    optionType: String,
    options: [{
        text: String,
        isCorrect: Boolean,
        marks: Number,
        optionsNextQuestion: String,
        recommendation: String
    }],
    linearScale: [{
        scale: Number,
        label: String,
        recommendation: String
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
            isCorrect: Boolean,
            marks: Number
        }]
    },
    requireResponse: Boolean,  
    marks: Number,
    country: {
        selectedCountry: String,
        countryFirstQuestion: Boolean
    },
    explanation: String,
    // recommendation: String,
    previousQuestion: String,
    nextQuestion: String,
    nestedTitle: {
        id: String,
        firstQuestion: Boolean
    },
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
            delete questionData.marks;
            if (questionData.optionType !== 'multipleChoiceGrid' && questionData.optionType !== 'checkboxGrid') {
                delete questionData.nextQuestion;
            }
        } else {
            if (questionData.optionType !== 'multipleChoiceGrid' && questionData.optionType !== 'checkboxGrid') {
                questionData.options = questionData.options.map(option => {
                    delete option.optionsNextQuestion;
                    return option;
                });
            }
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
