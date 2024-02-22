const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Titles = mongoose.model('titles');

const fetchTitles = async () => {
    try {
        const titles = await Titles.find({});
        console.log(titles);
        return titles;
    } catch (error) {
        console.error("Error fetching titles:", error);
        throw error;
    }
}

router.get('/displayTitles', async (req, res) => {
    try {
        const titles = await fetchTitles();
        res.json(titles);
    } catch (error) {
        res.status(500).send("Unable to fetch titles");
    }
});

router.get('/displayAllTitles', async (req, res) => {
    try {
        const titles = await fetchTitles();
        res.json(titles.map(t => ({ _id: t._id, title: t.title })));
    } catch (error) {
        res.status(500).send("Unable to fetch titles");
    }
});

module.exports = router;