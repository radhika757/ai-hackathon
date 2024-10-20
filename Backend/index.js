
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
            const { asin, review } = row;
    
            if (!products[asin]) products[asin] = [];
            products[asin].push(review); 
        })
        .on('end', async () => {
            try {
                const summaries = {};

                // Send each product's reviews to Gemini for summarization
                for (const [asin, reviews] of Object.entries(products)) {
                    // Join reviews into a single text block for summarization
                    const reviewsText = reviews.join('\n');
            
                    const prompt = `Summarize the following reviews for product ${asin}: ${reviewsText}. Give summary in 4 to 5 lines`;

                    // Send prompt to the Gemini API
                    const result = await model.generateContent({ prompt });

                    // Store the result as a summary for the current product
                    summaries[asin] = result.response.text();
                }

                // Send summarized reviews to frontend
                res.json({ summaries });
            } catch (error) {
                console.error('Error generating summary:', error);
                res.status(500).send('Error summarizing reviews.');
            }
        });
});
