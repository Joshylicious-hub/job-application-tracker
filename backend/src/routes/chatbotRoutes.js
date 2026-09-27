const express = require('express');
const router = express.Router();

const { chatBot } = require("../controllers/chatbotController");
const { validateToken, validateChatBot } = require("../middleware/authMiddleware");

router.post("/api/user/chatbot", validateToken, validateChatBot, chatBot);

module.exports = router;