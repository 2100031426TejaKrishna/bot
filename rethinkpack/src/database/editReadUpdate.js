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

router.get('/editReadUpdate/length', async (req, res) => {
    try {
        const length = await fetchQuestionsToEdit().collection.countDocuments();
        console.log(`length: ${length}`)
        res.json(length);
    } catch (error) {
        res.status(500).send("Unable to fetch questions");
    }
});

// Fetch ALL questions from database
router.get('/editReadUpdate/:id', async (req, res) => {
    try {
        const questions = await Questions.findById(req.params.id);
        res.json(questions);
    } catch (error) {
        res.status(500).send("Unable to fetch questions");
    }
});

module.exports = { router, fetchQuestionsToEdit };