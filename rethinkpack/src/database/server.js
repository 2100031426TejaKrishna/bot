const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db } = require('./database');
const { insertQuestion } = require('./insertQuestion');

const app = express();
app.use(cors());
app.use(bodyParser.json());

db();
insertQuestion();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});