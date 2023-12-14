const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://rethinkpack:RTfhUb5xVCI4QUhK@rtpdb.eswmapx.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, {
  dbName: 'Questions',
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to Questions database');
}).catch(err => {
  console.error(err);
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
  linearScale: [{
    scale: Number,
    label: String
  }],
  grid: {
    rows: [{
        text: String,
    }],
    columns: [{
      text: String,
      isCorrect: Boolean
    }]
  },
  requireResponse: Boolean,  
  marks: Number,
  countries: [String],
  explanation: String,
  recommendation: String,
  nextQuestion: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Questions = mongoose.model('questions', questionSchema);
Questions.createIndexes();

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

    if (questionData.optionType === 'linear') {
      delete questionData.options;
    } else {
      delete questionData.linearScale;
    }

    if (questionData.optionType === 'multipleChoiceGrid' || questionData.optionType === 'checkboxGrid') {
      delete questionData.options;
      delete questionData.linearScale;
    } else {
      delete questionData.grid;
      delete questionData.requireResponse;
    }
    
    questionData.date = new Date();
    console.log(questionData);

    const question = new Questions(questionData);
    let result = await question.save();
    result = result.toObject();
    console.log(result);

    res.send(questionData);
  } catch (error) {
    console.error("Error inserting question:", error);
    res.status(500).send("Something Went Wrong");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});