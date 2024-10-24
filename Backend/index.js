const express = require('express');
const bodyParser = require("body-parser");
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(
    cors({
        origin: process.env.ORIGIN
    })
);

// write route for upload
const uploadRoutes = require('./upload'); 
app.use('/api', uploadRoutes);

app.listen(process.env.PORT || 8000, () => {
    console.log(`server is running on ${process.env.PORT}`);
});
