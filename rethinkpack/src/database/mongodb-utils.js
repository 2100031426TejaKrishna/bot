const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; // Destructuring ObjectId from mongoose.Types
const Questions = mongoose.model('questions');
const router = express.Router();


// Fetch the first question
const fetchFirstQuestion = async () => {
    try {
        const question = await Questions.findOne({ firstQuestion: true });
        return question;
    } catch (error) {
        console.error("Error fetching the first question:", error);
        throw error;
    }
};

// Fetch the next question by ID or optionsNextQuestion
const fetchNextQuestion = async (nextQuestionId) => {
  try {
    // Try to find the question by ID first
    let question = await Questions.findById(nextQuestionId);

    if (!question) {
      // If not found, check if it's an optionsNextQuestion
      question = await Questions.findOne({
        'options._id': mongoose.Types.ObjectId(nextQuestionId),
      });
      
      // Populate the optionsNextQuestion field if found
      if (question && question.options) {
        const selectedOption = question.options.find(option =>
          option._id.equals(new mongoose.Types.ObjectId(nextQuestionId))
        );
        
        if (selectedOption && selectedOption.optionsNextQuestion) {
          question.optionsNextQuestion = selectedOption.optionsNextQuestion;
        }
      }
    }

    return question;
  } catch (error) {
    console.error("Error fetching the next question:", error);
    throw error;
  }
};

  // Function to fetch option text by ID
  const fetchOptionText = async (optionId) => {
    try {
      // console.log("Fetching option text for ID:", optionId);
  
      const question = await Questions.findOne({ "options._id": new mongoose.Types.ObjectId(optionId) });
  
      if (question && question.options) {
        const selectedOption = question.options.find(option => option._id.equals(new mongoose.Types.ObjectId(optionId)));
  
        if (selectedOption) {
          const optionText = selectedOption.text;
          // console.log("Found option text:", optionText);
          return optionText;
        } else {
          console.error("Selected option not found for ID:", optionId);
          throw new Error("Option not found");
        }
      } else {
        console.error("Question not found or has no options for ID:", optionId);
        throw new Error("Question not found or has no options");
      }
    } catch (error) {
      console.error("Error fetching option text:", error);
      throw error;
    }
  };
  
  //function to fetch option recommendation
  // Function to fetch option text by ID
  // const fetchRecommendation = async (optionId) => {
  //   try {
  //     // console.log("Fetching option text for ID:", optionId);
  
  //     const question = await Questions.findOne({ "options._id": new mongoose.Types.ObjectId(optionId) });
  
  //     if (question && question.options) {
  //       const selectedOption = question.options.find(option => option._id.equals(new mongoose.Types.ObjectId(optionId)));
  
  //       if (selectedOption) {
  //         const optionRecommendation = selectedOption.recommendation;
  //         // console.log("Found option text:", optionText);
  //         return optionRecommendation;
  //       } else {
  //         console.error("Selected option not found for ID:", optionId);
  //         throw new Error("Option not found");
  //       }
  //     } else {
  //       console.error("Question not found or has no options for ID:", optionId);
  //       throw new Error("Question not found or has no options");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching recommendation text:", error);
  //     throw error;
  
  //   }
  // };
// Endpoint to get the first question
router.get('/firstQuestion', async (req, res) => {
  try {
      const question = await fetchFirstQuestion();
      res.json(question);
  } catch (error) {
      res.status(500).send("Unable to fetch the first question");
  }
});

// Endpoint to get the next question
router.get('/nextQuestion/:id', async (req, res) => {
  try {
    const nextQuestionId = req.params.id;

    // Check if nextQuestionId is a valid ObjectId
    if (!ObjectId.isValid(nextQuestionId)) {
      throw new Error('Invalid ObjectId');
    }

    const question = await fetchNextQuestion(nextQuestionId);
    res.json(question);
  } catch (error) {
    res.status(500).send("Unable to fetch the next question");
  }
});

// Endpoint to get option text by ID
router.get('/optionText/:id', async (req, res) => {
  try {
    const optionId = req.params.id;
    const optionText = await fetchOptionText(optionId);

    // console.log("Found option text:", optionText);
    res.json({ texts: optionText }); // Return the text property in the correct format
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    console.error("Error fetching option text:", errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});


module.exports = { router};
// -------------------------------------this is the base line-------------------------------------------- ----- -----