const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });


const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


router.post('/upload', upload.single('file'), (req, res) => {
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
            products[asin].ratings.push(Number(rating));
        })
        .on('end', async () => {
            try {
                const finalData = [];

                // Send each product's reviews to Gemini for summarization
                for (const [asin, productData] of Object.entries(products)) {
                    const reviewsText = productData.reviews.join('\n');
                    const prompt = `Summarize the following reviews for product ${asin}: ${reviewsText}. Give two points, 1st is what people loved the most and 2nd is what people hated the most. The header should just be what they loved the most and what they hated the most.`;

                    const result = await model.generateContent(prompt);
                    const averageRating = productData.ratings.reduce((a, b) => a + b, 0) / productData.ratings.length;

                    let liked = 0;
                    let neutral = 0;
                    let disliked = 0;

                    productData.ratings.forEach(rating => {
                        if (rating >= 4) {
                            liked++;
                        } else if (rating >= 3 && rating < 4) {
                            neutral++;
                        } else {
                            disliked++;
                        }
                    });

                    finalData.push({
                        itemCode: asin,
                        name: productData.name,
                        averageRating: averageRating.toFixed(1),
                        liked:liked,
                        disliked:disliked,
                        neutral:neutral,
                        summary: result.response.text()
                    });
                }

                res.json(finalData);
            } catch (error) {
                console.error('Error generating summary:', error);
                res.status(500).send('Error summarizing reviews.');
            }
        });
});


// Generate suggestions based on reviews and rating.
router.post('/suggestions', async (req, res) => {
    const { prompt } = req.body;

    try {
        const result = await model.generateContent(prompt);
        res.json({ suggestions: result.response.text() });
    } catch (error) {
        console.error("Error generating suggestions:", error);
        res.status(500).json({ error: "Failed to generate suggestions." });
    }
});

module.exports = router;
