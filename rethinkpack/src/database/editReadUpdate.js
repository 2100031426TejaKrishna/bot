const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');

const fetchQuestionsToEdit = async () => {
    try {
        
        /*
        // Test run to fetch question field from first document of database
        const firstResultQuestion = await Questions.findOne();
    
        if (firstResultQuestion) {
            console.log(`Found a document: `);
            console.log(`Question: ${firstResultQuestion.question}`);
            
            // return values
            return firstResultQuestion.question;
        } else {
            console.log(`No document found.`)
        }
        */
        
        
        const questionsToEdit = await Questions.find({});
    
        if (questionsToEdit) {
            console.log(`Found list: `);
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

// Trial: Fetch question field from first document of database
router.get('/editReadUpdate', async (req, res) => {
    try {
        const questions = await fetchQuestionsToEdit();
        res.json(questions);
    } catch (error) {
        res.status(500).send("Unable to fetch questions");
    }
});

// Fetch ALL questions from database
router.get('/editReadUpdateQuestions/:id', async (req, res) => {
    try {
        const questions = await Questions.findById(req.params.id);
        res.json(questions);
    } catch (error) {
        res.status(500).send("Unable to fetch questions");
    }
});

module.exports = { router, fetchQuestionsToEdit };