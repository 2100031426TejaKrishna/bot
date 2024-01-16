const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Questions = mongoose.model('questions');

// Update question by ID from database test
router.put('/updateQuestion/:id', async (req, res) => {
    try {
        const update = await Questions.updateOne(
            { _id: req.params.id },
            { $set: req.body }
          );
          res.json(update);
    } catch (error) {
        console.log(`ERROR: editReadUpdate/update/id`)
        res.status(500).send("Unable to fetch questions");
    }
});

module.exports = router;