
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const bodyParser = require("body-parser");
require('dotenv').config();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

const upload = multer({ dest: 'uploads/' });
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
            products[asin].ratings.push(Number(rating));
        })
        .on('end', async () => {
            try {
                const finalData = [];
                
                // Send each product's reviews to Gemini for summarization
                for (const [asin, productData] of Object.entries(products)) {
                    const reviewsText = productData.reviews.join('\n');
                    const prompt = `Summarize the following reviews for product ${asin}: ${reviewsText}. Give summary in 4 to 5 lines`;

                    const result = await model.generateContent(prompt);
                    const averageRating = productData.ratings.reduce((a, b) => a + b, 0) / productData.ratings.length;
                  
                    finalData.push({
                        itemCode: asin,
                        name: productData.name,
                        averageRating: averageRating.toFixed(1),
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
app.post('/suggestions', async (req, res) => {
    const { prompt } = req.body;
  
    try {
      const result = await model.generateContent(prompt);
      res.json({ suggestions: result.response.text() });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions." });
    }
  });