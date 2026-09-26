const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express();
const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(authRoutes);

module.exports = app;