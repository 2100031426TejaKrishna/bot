// const mongoose = require('mongoose');

// const questionSchema = new mongoose.Schema({
//   name: String,
//   // Add other fields as needed
//   children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
// });

// const Question = mongoose.model('Question', questionSchema);

// module.exports = {
//   fetchQuestions: async () => {
//     // Implement the logic to fetch questions from MongoDB
//     try {
//       const questions = await Question.find(); // Example query to fetch all questions
//       return questions;
//     } catch (error) {
//       throw error;
//     }
//   },
// };