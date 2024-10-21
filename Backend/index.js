
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
require('dotenv').config();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

const upload = multer({ dest: 'uploads/' }); // Save uploaded files in 'uploads' directory
const PORT = 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


app.listen(PORT, () => {
    console.log("server is running on 3000");
});


app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).json("File not found")
    };

    const filePath = req.file.path;
    const products = {};

    // Parse CSV and group reviews by product
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const { asin, review, rating, name } = row;

            if (!products[asin]) {
                products[asin] = {
                    name: name,
                    reviews: [],
                    ratings: []
                };
            }

            // collect reviews & ratings
            products[asin].reviews.push(review);
            products[asin].ratings.push(parseFloat(rating));
        })
        .on('end', async () => {
            try {
                const summaries = {};
                const averageRatings = {};

                // Send each product's reviews to Gemini for summarization
                for (const [asin, { name, reviews, ratings }] of Object.entries(products)) {
                    // Join reviews into a single text block for summarization
                    const reviewsText = reviews.join('\n');

                    const prompt = `Summarize the following reviews for product ${asin}: ${reviewsText}. Give summary in 4 to 5 lines`;

                    const result = await model.generateContent(prompt);
                    summaries[asin] = { name: name, summary: result.response.text() };

                    // Calculate average rating
                    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
                    averageRatings[asin] = averageRating;
                }
               
                // Send summarized reviews to frontend
                res.json({ summaries, averageRatings });
            } catch (error) {
                console.error('Error generating summary:', error);
                res.status(500).send('Error summarizing reviews.');
            }
        });
});
