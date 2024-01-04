const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToDatabase = require('./database');
const insertQuestionRoute = require('./insertQuestion');
const { router: displayQuestionRoute, fetchQuestions } = require('./displayQuestion');
const { router: editReadUpdateRoute, fetchQuestionsToEdit } = require('./editReadUpdate');
const deleteQuestionRouter = require('./deleteQuestion'); 

const corsOptions = {
  origin: ['http://rtp.dusky.bond'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

connectToDatabase().then(async () => {
  console.log("Database connected!");

  app.use('/api', insertQuestionRoute);
  app.use('/api', displayQuestionRoute);
  app.use('/api', editReadUpdateRoute);
  app.use('/api', deleteQuestionRouter);
  await fetchQuestions();
  await fetchQuestionsToEdit();

  const PORT = 5000;

  // Use '0.0.0.0' as the host to listen on all network interfaces
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  // app.listen(PORT, () => {
  //   console.log(`Server running on http://localhost:${PORT}`);
  // })

}).catch(error => {
  console.error("Failed to connect to the database:", error);
});