const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');

const fetchQuestionsToEdit = async () => {
    try {
        
        // Test run to fetch first document of database
        /* 
        const firstResult = await Questions.findOne();
    
        if (firstResult) {
            console.log(`Found a document: `);
            console.log(firstResult);
        } else {
            console.log(`No document found.`)
        }
        */


        // Test run to fetch question field from first document of database
        
        const firstResultQuestion = await Questions.findOne();
    
        if (firstResultQuestion) {
            console.log(`Found a document: `);
            console.log(`Question: ${firstResultQuestion.question}`);
        } else {
            console.log(`No document found.`)
        }
        
        
        // Test run loading ALL documents with question field
        /*
        const questionsToEdit = await Questions.find({});
    
        if (questionsToEdit) {
            console.log(`Found a document: `);
            console.log(`Question: ${questionsToEdit}`);
            return questionsToEdit;
        } else {
            console.log(`No document found.`)
        }
        */


    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
}

router.get('/editReadUpdate', async (req, res) => {
    try {
        const questions = await fetchQuestionsToEdit();
        res.json(questions);
    } catch (error) {
        res.status(500).send("Unable to fetch questions");
    }
});

module.exports = { router, fetchQuestionsToEdit };