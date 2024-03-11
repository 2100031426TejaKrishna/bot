const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Questions = mongoose.model('questions');

// Fetch question by ID from database
router.get('/read/:id', getQuestion, (req, res) => {
    // res.send(res.question.question)
    res.json(res.question);
});


// Update question by ID from database
router.patch('/update/:id', async (req, res) => {
    console.log(`updateQuestion router executed`);
    try {
        const update = await Questions.updateOne(
            { _id: req.params.id },
            { $set: req.body }
          );
          res.json(update);
    } catch (error) {
        console.log(`ERROR: editReadUpdate/id`)
        res.status(500).send("Unable to fetch questions");
    }
});

// Function to fetch question by Id
async function getQuestion(req, res, next) {
    let question 
    try {
        question = await Questions.findById(req.params.id);

        if (question == null) {
            return res.status(404).json({message: "Cannot find question"})
        }
    } catch (err) {
        return res.status(500).json({message: "error message"})
    }
    res.question = question
    next()
}

// Add this route to get the filtered questions
router.get('/filtered-questions', async (req, res) => {
    try {
        // Fetch all questions
        const allQuestions = await Questions.find();

        // Fetch used question IDs from nextQuestion and optionsNextQuestion fields
        const usedQuestionIds = allQuestions.reduce((acc, question) => {
            if (question.nextQuestion) {
                acc.push(question.nextQuestion.toString()); // Convert ObjectId to string
            }
            if (question.options) {
                question.options.forEach(option => {
                    if (option.optionsNextQuestion) {
                        acc.push(option.optionsNextQuestion.toString()); // Convert ObjectId to string
                    }
                });
            }
            return acc;
        }, []);

        console.log('All Question IDs:', allQuestions.map(q => q._id.toString()));
        console.log('Used Question IDs:', usedQuestionIds);

        // Filter questions based on criteria
        const filteredQuestions = allQuestions.filter(question => (
            !usedQuestionIds.includes(question._id.toString()) &&
            !question.marks // Exclude leading questions by checking if marks property is falsy
        ));

        console.log('Filtered Questions IDs:', filteredQuestions.map(q => q._id.toString()));

        res.json(filteredQuestions);
    } catch (error) {
        console.error('Error fetching filtered questions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;