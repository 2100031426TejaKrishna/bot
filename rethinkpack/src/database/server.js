const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToDatabase = require('./database');
const insertQuestionRoute = require('./insertQuestion');
const displayQuestionRoute = require('./displayQuestion');
const submitResponseRoute = require('./insertCustomerResponse');
const { router: treeMapRouter} = require('./mongodb-utils');
const editReadUpdateRoute = require('./editReadUpdate');
const deleteQuestionRouter = require('./deleteQuestion');
const deleteTitleRouter = require('./deleteTitle');
const insertTitlesRoute = require('./insertTitles');
const displayTitlesRoute = require('./displayTitles');
const displayCustomerQuestionRoute = require('./displayCustomerQuestion');
const duplicateQuestionRoute = require('./duplicateQuestions');
const recommendationRoute = require('./recommendation');
const loginapi = require('./loginapi');


const corsOptions = {
  origin: ['http://rtp.dusky.bond'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

const app = express();
// app.options('*',cors());
// var allowCrossDomain = function(req,res,next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();  
// }
// app.use(allowCrossDomain);

app.use(cors());
app.use(cors(corsOptions));
app.use(bodyParser.json());

connectToDatabase().then(async () => {
  console.log("Database connected!");
  app.use('/api', insertQuestionRoute);
  app.use('/api', displayQuestionRoute);
  app.use('/api', submitResponseRoute);
  app.use('/api', editReadUpdateRoute);
  app.use('/api', deleteQuestionRouter);
  app.use('/api', deleteTitleRouter);
  app.use('/api', treeMapRouter);
  app.use('/api', insertTitlesRoute);
  app.use('/api', displayTitlesRoute);
  app.use('/api', displayCustomerQuestionRoute);
  app.use('/api', duplicateQuestionRoute);
  app.use('/api', recommendationRoute);
  app.use('/api', loginapi); // Add the loginapi routes

  // const PORT = 5000;
  
  // Use '0.0.0.0' as the host to listen on all network interfaces
  // app.listen(PORT, '0.0.0.0', () => {
  //   console.log(`Server running on http://0.0.0.0:${PORT}`);
  // });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
}).catch(error => {
  console.error("Failed to connect to the database:", error);
});
