const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToDatabase = require('./database');
const insertQuestionRoute = require('./insertQuestion');

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectToDatabase().then(() => {
  console.log("Database connected!");

  app.use('/api', insertQuestionRoute);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

}).catch(error => {
  console.error("Failed to connect to the database:", error);
});
