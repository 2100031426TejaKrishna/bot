const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToDatabase = require('./database');
const { router: displayQuestionRoute, fetchQuestions } = require('./displayQuestion');

const corsOptions = {
  origin: ['http://rtp.dusky.bond'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

const app = express();
app.use(cors());
// app.use(cors(corsOptions));
app.use(bodyParser.json());

connectToDatabase().then(async () => {
  console.log("Database connected!");
  app.use('/api', displayQuestionRoute);
  await fetchQuestions();

//   const PORT = 5000;

//   // Use '0.0.0.0' as the host to listen on all network interfaces
//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on http://0.0.0.0:${PORT}`);
//   });

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

}).catch(error => {
  console.error("Failed to connect to the database:", error);
});
