const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express();
const authRoutes = require("./routes/authRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(authRoutes);
app.use(chatbotRoutes);

module.exports = app;