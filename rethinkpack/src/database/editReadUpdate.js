const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');

const fetchQuestionsToEdit = async () => {
    try {
        const questionsToEdit = await Questions.find({});
    
        if (questionsToEdit) {
            console.log(`Found list: `);
            console.log(`Length: ${questionsToEdit.length}`);
            console.log(`Question: ${questionsToEdit}`);
            return questionsToEdit;
        } else {
            console.log(`No document found.`)
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
}

// Fetch question by ID from database
router.get('/editReadUpdate/:id', async (req, res) => {
    try {
        const question = await Questions.findById(req.params.id);
        res.json(question);
    } catch (error) {
        console.log(`ERROR: editReadUpdate/id`)
        res.status(500).send("Unable to fetch questions");
    }
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

module.exports = { router, fetchQuestionsToEdit };