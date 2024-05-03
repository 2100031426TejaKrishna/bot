const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Questions = mongoose.model('questions');

// Route handler for duplicating a question
router.post('/duplicateQuestion', async (req, res) => {
    try {
        const { question } = req.body;
        // Create a duplicate of the question
        // const duplicatedQuestion = duplicateQuestion(question);
        // Save the duplicated question to the database
        console.log("inside database duplicate question routes") 
        const newQuestion = await Questions.create(question);
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error('Error duplicating question:', error);
        res.status(500).json({ error: 'Failed to duplicate question' });
    }
});

module.exports = router;