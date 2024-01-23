
const express = require('express');
const mongoose = require('mongoose');
const Questions = mongoose.model('questions');
const router = express.Router();

const fetchDataFromMongoDB = async (req, res, next) => {
  try {
    // Check if req.params is defined and contains 'id' property
    const id = req.params && req.params.id;
    if (!id) {
      throw new Error('Invalid request, missing parameter: id');
    }

    const data = await Questions.findOne({ _id: id }).lean().exec();

    // Attach the fetched data to the request object for later use
    req.fetchedData = data;

    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).send("Internal Server Error");
  }
};

router.get('/question/:id', fetchDataFromMongoDB, async (req, res) => {
  try {
    const question = await Questions.findById(req.params.id);
    if (!question) {
      return res.status(404).send("Question not found");
    }
    res.json({ ...question._doc, additionalData: req.fetchedData });
  } catch (error) {
    console.error("Error fetching specific question:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/api/findRootQuestion', async (req, res) => {
  try {
    // Find the root question based on your data model
    const rootQuestion = await Questions.findOne({ isRoot: true });
    if (!rootQuestion) {
      return res.status(404).json({ message: 'Root question not found' });
    }
    res.json(rootQuestion);
  } catch (error) {
    console.error('Error finding root question:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = { router, fetchDataFromMongoDB };