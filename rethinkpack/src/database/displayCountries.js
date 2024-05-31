const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Questions = mongoose.model('questions');

const fetchCountries = async () => {
    try {
        const result = await Questions.aggregate([
            { $unwind: "$countries" },  // Unwind the countries array
            { $match: { countries: { $ne: null, $exists: true, $ne: "" } } },  // Ensure countries are not null, not empty, and exist
            { $group: { _id: "$countries" } },  // Group by country to get unique values
            { $sort: { _id: 1 } }  // Sort the countries alphabetically
        ]);
        console.log('Aggregation result:', result);  // Log the result for debugging
        return result.map(country => country._id);  // Extract country names from the result
    } catch (error) {
        console.error("Error in aggregation pipeline:", error);
        throw error;
    }
};

// Route to display countries
router.get('/displayCountries', async (req, res) => {
    try {
        const countries = await fetchCountries();
        res.json(countries);
    } catch (error) {
        console.error("Error fetching countries:", error);
        res.status(500).send("Unable to fetch countries");
    }
});

// Route to get detailed information of the countries
router.get('/countryDetails', async (req, res) => {
    try {
        const questions = await Questions.find({}, 'countries');
        const countriesDetails = [];

        questions.forEach(question => {
            if (question.countries && question.countries.length) {
                question.countries.forEach(country => {
                    if (!countriesDetails.includes(country)) {
                        countriesDetails.push(country);
                    }
                });
            }
        });

        res.json(countriesDetails);
    } catch (error) {
        console.error("Error fetching country details:", error);
        res.status(500).send("Unable to fetch country details");
    }
});

module.exports = router;