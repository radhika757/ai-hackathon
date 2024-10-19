
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
console.log(process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


async function runPrompt(){
    const prompt = "Write a story about a magic book.";
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
}

runPrompt();
