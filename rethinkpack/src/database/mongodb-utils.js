const express = require('express');
const mongoose = require('mongoose');
const Questions = mongoose.model('questions');
const router = express.Router();


// Fetch the first question
const fetchFirstQuestion = async () => {
    try {
        const question = await Questions.findOne({ firstQuestion: true });
        return question;
    } catch (error) {
        console.error("Error fetching the first question:", error);
        throw error;
    }
};

// Fetch the next question by ID
const fetchNextQuestion = async (nextQuestionId) => {
    try {
        const question = await Questions.findById(nextQuestionId);
        return question;
    } catch (error) {
        console.error("Error fetching the next question:", error);
        throw error;
    }
};

// Endpoint to get the first question
router.get('/firstQuestion', async (req, res) => {
  try {
      const question = await fetchFirstQuestion();
      res.json(question);
  } catch (error) {
      res.status(500).send("Unable to fetch the first question");
  }
});

// Endpoint to get the next question
router.get('/nextQuestion/:id', async (req, res) => {
    try {
        const question = await fetchNextQuestion(req.params.id);
        res.json(question);
    } catch (error) {
        res.status(500).send("Unable to fetch the next question");
    }
});

module.exports = { router };
// -------------------------------------this is the base line-------------------------------------------- ----- -----