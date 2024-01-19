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

module.exports = router;