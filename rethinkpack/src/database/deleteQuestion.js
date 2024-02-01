const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');

router.delete('/deleteQuestion/:id', async (req, res) => {
    const questionId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).send('Invalid ID');
    }

    try {
        const result = await Questions.findByIdAndDelete(questionId);
        if (!result) {
            return res.status(404).send('Question not found');
        }
        res.send({ message: 'Question deleted successfully', id: questionId });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).send("Unable to delete question");
    }
});

// Update questions
// clear all cases of nextQuestion and optionsNextQuestion 
// that match with the deleted question
router.patch('/clearNextQuestion', async (req, res) => {
    console.log(`clearNextQuestion router executed`);
    try {
        const { questionId, clearNextQuestionArray, clearOptionsNextQuestionArray } = req.body;

        // Update nextQuestion logic
        const updateNextQuestion = await Questions.updateMany(
            { _id: { $in: clearNextQuestionArray.map(item => item.questionId) } },
            {
                $set: {
                    'nextQuestion': '',
                    // Add more fields here if needed
                }
            }
        );

        // Update optionsNextQuestion logic for each index
        const updateOptionsNextQuestionPromises = clearOptionsNextQuestionArray.map(async (item) => {
            const { questionId, optionsIndex } = item;
            return await Questions.updateMany(
                { _id: questionId },
                {
                    $set: {
                        [`options.${optionsIndex}.optionsNextQuestion`]: '',
                    }
                }
            );
        });

        // Wait for all updates to complete
        const updateOptionsNextQuestionResults = await Promise.all(updateOptionsNextQuestionPromises);

        res.json({ updateNextQuestion, updateOptionsNextQuestionResults });
    } catch (error) {
        console.error('Error updating questions:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});




  

module.exports = router;
