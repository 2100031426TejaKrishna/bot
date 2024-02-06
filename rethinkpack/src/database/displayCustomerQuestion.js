const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');

// const fetchQuestions = async () => {
//     try {
//         let allQuestions = new Map();
//         let queue = [];
//         let firstQuestion = await Questions.findOne({ firstQuestion: true });
//         if (firstQuestion) {
//             queue.push(firstQuestion);
//         }

//         while (queue.length > 0) {
//             let currentQuestion = queue.shift();
//             allQuestions.set(currentQuestion._id.toString(), currentQuestion);

//             // Function to handle adding next questions to the queue
//             const addNextQuestionToQueue = async (nextQuestionId) => {
//                 if (!allQuestions.has(nextQuestionId.toString())) {
//                     let nextQuestion = await Questions.findById(nextQuestionId);
//                     if (nextQuestion) {
//                         queue.push(nextQuestion);
//                     }
//                 }
//             };

//             // Check and enqueue the nextQuestion if not already processed
//             if (currentQuestion.nextQuestion) {
//                 let nextQuestionId = new mongoose.Types.ObjectId(currentQuestion.nextQuestion);
//                 await addNextQuestionToQueue(nextQuestionId);
//             }

//             // Process options and their nextQuestions
//             if (currentQuestion.options && currentQuestion.options.length > 0) {
//                 for (let option of currentQuestion.options) {
//                     if (option.optionsNextQuestion) {
//                         let optionNextQuestionId = new mongoose.Types.ObjectId(option.optionsNextQuestion);
//                         await addNextQuestionToQueue(optionNextQuestionId);
//                     }
//                 }
//             }
//         }

//         return Array.from(allQuestions.values());
//     } catch (error) {
//         console.error("Error fetching all questions:", error);
//         throw error;
//     }
// };

// router.get('/fetchQuestions', async (req, res) => {
//     try {
//         const questions = await fetchQuestions();
//         res.json(questions);
//     } catch (error) {
//         res.status(500).send("Unable to fetch all questions");
//     }
// });

const fetchFirstQuestion = async () => {
    try {
        const firstQuestion = await Questions.findOne({ firstQuestion: true });
        if (!firstQuestion) {
            throw new Error("No first question found.");
        }
        return firstQuestion;
    } catch (error) {
        console.error("Error fetching the first question:", error);
        throw error;
    }
};

const fetchNextQuestion = async (currentQuestionId, selectedOptionId = null) => {
    try {
        let nextQuestionId;

        // If an option ID is provided, find the next question from the option
        if (selectedOptionId) {
            const currentQuestion = await Questions.findById(currentQuestionId);
            const selectedOption = currentQuestion.options.find(option => option._id.equals(selectedOptionId));
            if (selectedOption && selectedOption.optionsNextQuestion) {
                nextQuestionId = selectedOption.optionsNextQuestion;
            }
        } else {
            // Otherwise, use the nextQuestion field of the current question
            const currentQuestion = await Questions.findById(currentQuestionId);
            if (currentQuestion && currentQuestion.nextQuestion) {
                nextQuestionId = currentQuestion.nextQuestion;
            }
        }

        if (!nextQuestionId) {
            return null; // No next question found
        }

        const nextQuestion = await Questions.findById(nextQuestionId);
        return nextQuestion;
    } catch (error) {
        console.error("Error fetching the next question:", error);
        throw error;
    }
};

// Route to fetch the first question
router.get('/fetchFirstQuestion', async (req, res) => {
    try {
        const firstQuestion = await fetchFirstQuestion();
        res.json(firstQuestion);
    } catch (error) {
        res.status(500).send("Unable to fetch the first question");
    }
});

// Route to fetch the next question based on the current question and selected option
router.get('/fetchNextQuestion/:currentQuestionId/:selectedOptionId?', async (req, res) => {
    try {
        const { currentQuestionId, selectedOptionId } = req.params;
        const nextQuestion = await fetchNextQuestion(currentQuestionId, selectedOptionId);
        if (nextQuestion) {
            res.json(nextQuestion);
        } else {
            res.status(404).send("No next question found");
        }
    } catch (error) {
        res.status(500).send("Unable to fetch the next question");
    }
});

module.exports = router;