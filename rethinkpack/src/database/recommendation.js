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

// Route to fetch recommendation by Option ID
// router.get('/recommendation/option/:id', async (req, res) => {
//     try {
//         const recommendation = await fetchOptionRecommendation(req.params.id);
//         res.json({ recommendation });
//     } catch (error) {
//         console.error('Error fetching recommendation:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });
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
  
// router.post('/recommendation/option/:id', async (req, res) => {
//     const optionId = req.params.id;
//     const newRecommendation = req.body.recommendation;

//     try {
//         const question = await Questions.findOneAndUpdate(
//             { "options._id": new mongoose.Types.ObjectId(optionId) },
//             { $set: { "options.$.recommendation": newRecommendation } },
//             { new: true }
//         );

//         if (question) {
//             res.status(200).json({ message: 'Recommendation updated successfully' });
//         } else {
//             res.status(404).json({ message: 'Option not found' });
//         }
//     } catch (error) {
//         console.error('Error storing recommendation:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });
module.exports = router;
