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

module.exports = router;
