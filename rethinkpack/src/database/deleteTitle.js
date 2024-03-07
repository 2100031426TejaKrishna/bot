const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the schema for the Titles model
const titleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    // Add other properties of your titles collection as needed
    // For example:
    subTitle: {
        type: String,
        required: true
    },
    nestedTitle: {
        type: String
        // This can be an array or object depending on your data structure
    }
});

// Create the Titles model using the schema
const Titles = mongoose.model('Titles', titleSchema);

router.delete('/deleteTitle/:id', async (req, res) => {
    const titleId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(titleId)) {
        return res.status(400).send('Invalid ID');
    }

    try {
        const result = await Titles.findByIdAndDelete(titleId);
        if (!result) {
            return res.status(404).send('Title not found');
        }
        res.send({ message: 'Title deleted successfully', id: titleId });
    } catch (error) {
        console.error("Error deleting title:", error);
        res.status(500).send("Unable to delete title");
    }
});

module.exports = router;
