const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToDatabase = require('./database');
const insertQuestionRoute = require('./insertQuestion');
const { router: displayQuestionRoute, fetchQuestions } = require('./displayQuestion');
const { router: editReadUpdateRoute, fetchQuestionsToEdit } = require('./editReadUpdate');
const deleteQuestionRouter = require('./deleteQuestion'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectToDatabase().then(async () => {
  console.log("Database connected!");

  app.use('/api', insertQuestionRoute);
  app.use('/api', displayQuestionRoute);
  app.use('/api', editReadUpdateRoute);
  app.use('/api', deleteQuestionRouter);
  await fetchQuestions();
  await fetchQuestionsToEdit();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

}).catch(error => {
  console.error("Failed to connect to the database:", error);
});
