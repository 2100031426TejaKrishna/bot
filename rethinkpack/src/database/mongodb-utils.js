const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// Connect to the database


// Endpoint to get all questions
router.get('/displayQuestions', async (req, res) => {
  try {
    const questions = await Questions.find().exec();
    res.json(questions);
  } catch (error) {
    res.status(500).send("Unable to fetch questions");
  }
});

// Endpoint to get the first question
router.get('/firstQuestion', async (req, res) => {
  try {
    const question = await Questions.findOne({ firstQuestion: true });
    res.json(question);
  } catch (error) {
    res.status(500).send("Unable to fetch the first question");
  }
});

// Endpoint to get the next question
router.get('/nextQuestion/:id', async (req, res) => {
  try {
    const nextQuestionId = req.params.id;
    const question = await Questions.findById(nextQuestionId);
    res.json(question);
  } catch (error) {
    res.status(500).send("Unable to fetch the next question");
  }
});

// Endpoint to get option text by ID
router.get('/optionText/:id', async (req, res) => {
  try {
    const optionId = req.params.id;
    const question = await Questions.findOne({ "options._id": new mongoose.Types.ObjectId(optionId) });
    const optionText = question.options.find(option => option._id.equals(new mongoose.Types.ObjectId(optionId))).text;
    res.json({ texts: optionText });
  } catch (error) {
    res.status(500).send("Unable to fetch option text");
  }
});

module.exports = { router };