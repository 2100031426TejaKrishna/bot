const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://rethinkpack:RTfhUb5xVCI4QUhK@rtpdb.eswmapx.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', async () => {
  try {
    const adminDb = db.db.admin();
    const databaseList = await adminDb.listDatabases();

    console.log("List of databases:");
    databaseList.databases.forEach((db) => {
      console.log(db.name);
    });
    insertQuestion();

    // db.close();
  } catch (error) {
    console.error('Error listing databases:', error);
  }
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

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

const insertQuestion = async () => {
  const questionData = {
    questionType: "Product Information",
    question: "What is this question?",
    optionType: "Multiple choice",
    options: [
      { text: "abc", isCorrect: false },
      { text: "bcd", isCorrect: true },
      { text: "cde", isCorrect: true },
      { text: "def", isCorrect: false }
    ],
    mark: 2,
    nextQuestion: "Question 2"
  };

  try {
    const questionsDb = mongoose.connection.useDb('Questions');
    const collection = questionsDb.collection('questions');

    const result = await collection.insertOne(questionData);
    console.log("Question inserted with ID:", result.insertedId);
  } catch (error) {
    console.error("Error inserting question:", error);
  }
};

const questionsDb = mongoose.connection.useDb('Questions');
const collection = questionsDb.collection('questions');

app.post('/insertQuestion', async (req, res) => {
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});