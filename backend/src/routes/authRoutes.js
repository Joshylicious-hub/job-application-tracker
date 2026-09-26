const express = require("express");
const router = express.Router();

const { validateLogin, validateRegistration, validateToken } = require("../middleware/authMiddleware");
const { limit } = require("../middleware/rateLimitMiddleware");
const { loginDB, registerDB, profileDB, applicationDB } = require("../controllers/authController");

router.post("/api/user/login", limit, validateLogin, loginDB);
router.post("/api/user/register", validateRegistration, registerDB);
router.get("/api/user/name", validateToken, profileDB);
router.get("/api/user/application", validateToken, applicationDB);

module.exports = router;