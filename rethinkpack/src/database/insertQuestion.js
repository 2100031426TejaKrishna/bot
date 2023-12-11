const mongoose = require('mongoose');

const questionsDb = mongoose.connection.useDb('Questions');
const collection = questionsDb.collection('questions');

const questionSchema = new mongoose.Schema({
  questionType: String,
  question: String,
  optionType: String,
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  mark: Number,
  countries: [String],
  explanation: String,
  recommendation: String,
  nextQuestion: String
});

const insertQuestion = async (req, res) => {
    try {
        let questionData = req.body;

        if (questionData.isLeadingQuestion) {
            questionData.recommendation = questionData.explanation;
            delete questionData.explanation;
            delete questionData.mark;
        }

        if (!questionData.showCountry) {
            delete questionData.countries;
        }

        const result = await collection.insertOne(questionData);
        console.log("Question inserted with ID:", result.insertedId);
    } catch (error) {
        console.error("Error inserting question:", error);
    }
};

module.exports = { insertQuestion };
