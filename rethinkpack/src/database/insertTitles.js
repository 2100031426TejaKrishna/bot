const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const titlesSchema = new mongoose.Schema({
    title: {
        titleLabel: String,
        subTitle: [
            {
                subTitleLabel: String,
                // questionsSubTitle: [String],
                nestedTitle: [ 
                    { 
                        nestedTitleLabel: String,
                        // questionsNestedTitle: [String] 
                    }
                ]
            }
        ]
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Titles = mongoose.model('titles', titlesSchema);
Titles.createIndexes();

router.post('/insertTitle', async (req, res) => {
    try {
        let titleData = req.body;
        // console.log(JSON.parse(titleData));
        console.log(titleData);

        const title = new Titles(titleData);
        let result = await title.save();
        result = result.toObject();
        console.log(result);
        res.send(titleData);
    } catch (error) {
        console.error("Error inserting title:", error);
        res.status(500).send("Titles: Something Went Wrong");
    }
});

router.put('/updateTitle/:id', async (req, res) => {
    try {
        const titleId = req.params.id;
        const updatedData = req.body;
        
        // Fetch the existing title data from the database
        const existingTitle = await Titles.findById(titleId);

        // Ensure that the title exists
        if (!existingTitle) {
            return res.status(404).json({ error: 'Title not found' });
        }

        // Update only the fields that are present and not empty in the updatedData
        for (const key in updatedData) {
            if (updatedData[key] !== undefined && updatedData[key] !== null && updatedData[key] !== '') {
                existingTitle[key] = updatedData[key];
            }
        }

        // Save the updated title
        const updatedTitle = await existingTitle.save();

        // Respond with the updated title
        res.json(updatedTitle);
    } catch (error) {
        console.error("Error updating title:", error);
        res.status(500).send("Error updating title");
    }
});



module.exports = router;
