const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const uri = "mongodb+srv://rethinkpack:RTfhUb5xVCI4QUhK@rtpdb.eswmapx.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', async () => {
  try {
    // Get the list of database names
    const adminDb = db.db.admin();
    const databaseList = await adminDb.listDatabases();

    // Print the list of database names
    console.log("List of databases:");
    databaseList.databases.forEach((db) => {
      console.log(db.name);
    });

    // Close the database connection
    db.close();
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
  // ... other fields
});

const Question = mongoose.model('Questions', questionSchema);

app.post('/insertQuestion', async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    const result = await newQuestion.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});