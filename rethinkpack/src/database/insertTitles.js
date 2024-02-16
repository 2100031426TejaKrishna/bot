const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const titlesSchema = new mongoose.Schema({
    title: {
        titleLabel: String,
        subTitle: [
            {
                subTitleLabel: String,
                nestedTitle: [{ nestedTitleLabel: String }]
            }
        ]
    }
});

const Titles = mongoose.model('titles', titlesSchema);
Titles.createIndexes();

router.post('/insertTitle', async (req, res) => {
    try {
        let titleData = req.body;
        console.log(JSON.parse(titleData));

        const title = new Titles(titleData);
        let result = await title.save();
        result = result.toObject();
        console.log(result);
        res.send(titleData);
    } catch (error) {
        console.error("Error inserting question:", error);
        res.status(500).send("Titles: Something Went Wrong");
    }
});

module.exports = router;
