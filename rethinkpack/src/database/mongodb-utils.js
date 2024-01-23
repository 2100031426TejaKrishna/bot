const mongoose = require('mongoose');
const Question = require('/home/username/Desktop/Git/Assessment-tool/rethinkpack/src/database/models_question.js'); // Replace with your actual import path

// Assuming you've already established a connection to your MongoDB database
// mongoose.connect('mongodb://your-mongodb-uri', { useNewUrlParser: true, useUnifiedTopology: true });
const Questions = mongoose.model('questions');
const fetchDataFromMongoDB = async () => {
  try {
    // Replace the query conditions and projection with your actual requirements
    const data = await Questions.findOne({ _id: '658132f11dafefd7f1601076' }, '658538a6ce58d563c955907f').lean().exec();
    return data; // Adjust the returned data structure based on your needs
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    throw error; // Propagate the error for handling in the component
  }
};

module.exports = { fetchDataFromMongoDB };