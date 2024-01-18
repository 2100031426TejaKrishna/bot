const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');

const fetchQuestionsToEdit = async () => {
    // try {
    //     const questionsToEdit = await Questions.find({});
    
    //     if (questionsToEdit) {
    //         console.log(`Found list: `);
    //         console.log(`Length: ${questionsToEdit.length}`);
    //         console.log(`Question: ${questionsToEdit}`);
    //         return questionsToEdit;
    //     } else {
    //         console.log(`No document found.`)
    //     }
    // } catch (error) {
    //     console.error("Error fetching questions:", error);
    //     throw error;
    // }
}

// Fetch question by ID from database
// router.get('/editReadUpdate/:id', async (req, res) => {
//     try {
//         const question = await Questions.findById(req.params.id);
//         res.json(question);
//     } catch (error) {
//         console.log(`ERROR: editReadUpdate/id`)
//         res.status(500).send("Unable to fetch questions");
//     }
// });

// Fetch question by ID from database
router.get('/read/:id', getQuestion, (req, res) => {
    // res.send(res.question.question)
    res.json(res.question);
});


// Update question by ID from database
router.patch('/update/:id', async (req, res) => {
    console.log(`updateQuestion router executed`);
    try {
        const update = await Questions.updateOne(
            { _id: req.params.id },
            { $set: req.body }
          );
          res.json(update);
    } catch (error) {
        console.log(`ERROR: editReadUpdate/id`)
        res.status(500).send("Unable to fetch questions");
    }
});

// Trial
// router.patch('/update/:id', getQuestion, async (req, res) => {
//     console.log(`updateQuestion router executed`);
//     res.question.question = req.body.question

//     try {
//         const updatedQuestion = await res.question.save()
//         res.json(updatedQuestion)

//     } catch(err) {
//         res.status(400).json({message: "error"})

//     }
    
// });

async function getQuestion(req, res, next) {
    let question 
    try {
        question = await Questions.findById(req.params.id);

        if (question == null) {
            return res.status(404).json({message: "Cannot find question"})
        }

    } catch (err) {
        return res.status(500).json({message: "error message"})
    }
    res.question = question
    next()
}

module.exports = { router, fetchQuestionsToEdit };