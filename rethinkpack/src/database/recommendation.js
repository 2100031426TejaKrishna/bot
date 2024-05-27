const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Questions = mongoose.model('questions');  // Assuming 'questions' is already defined in your schema

// Function to fetch recommendation by Option ID
const fetchRecommendationText = async (optionId) => {
    try {
        // console.log("Fetching recommendation for option ID:", optionId);

        // Find the question containing the option with the specified ID
        const question = await Questions.findOne({ "options._id": new mongoose.Types.ObjectId(optionId) });

        if (question && question.options) {
            // Find the option with the specified ID
            const selectedOption = question.options.find(option => option._id.equals(new mongoose.Types.ObjectId(optionId)));

            if (selectedOption) {
                // Extract the recommendation from the selected option
                const recommendationText = selectedOption.recommendation;
                // console.log("Found recommendation:", recommendation);
                return recommendationText;
            } else {
                console.error("Selected option not found for ID:", optionId);
                throw new Error("Option not found");
            }
        } else {
            console.error("Question not found or has no options for ID:", optionId);
            throw new Error("Question not found or has no options");
        }
    } catch (error) {
        console.error("Error fetching recommendation:", error);
        throw error;
    }
};


router.get('/recommendationText/:id', async (req, res) => {
    try {
      const optionId = req.params.id;
      const recommendationText = await fetchRecommendationText(optionId);
  
      // console.log("Found option text:", optionText);
      res.json({ recommendations: recommendationText}); // Return the text property in the correct format
    } catch (error) {
      const errorMessage = error.message || "Internal Server Error";
      console.error("Error fetching option text:", errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  });
  

module.exports = router;
