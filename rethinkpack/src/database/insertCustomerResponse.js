const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const responseSchema = new mongoose.Schema({
    userId: String,
    responses: [{
        questionId: String,
        answer: mongoose.Schema.Types.Mixed 
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const CustomerResponse = mongoose.model('customerResponses', responseSchema);
CustomerResponse.createIndexes();

router.post('/submitResponse', async (req, res) => {
    try {
        const { userId, responses } = req.body;

        const customerResponse = new CustomerResponse({
            userId: userId,
            responses: responses.map(response => ({
                questionId: response.questionId,
                answer: response.answer 
            }))
        });

        await customerResponse.save();
        res.status(200).send("Response submitted successfully.");
    } catch (error) {
        console.error("Error submitting response:", error);
        res.status(500).send("Error submitting response");
    }
});

module.exports = router;
