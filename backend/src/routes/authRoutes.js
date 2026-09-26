const express = require("express");
const router = express.Router();

const { validateLogin, validateRegistration, validateToken, validateApplication } = require("../middleware/authMiddleware");
const { limit } = require("../middleware/rateLimitMiddleware");
const { loginDB, registerDB, profileDB, applicationDB, insertApplicationDB } = require("../controllers/authController");

router.post("/api/user/login", limit, validateLogin, loginDB);
router.post("/api/user/register", validateRegistration, registerDB);
router.get("/api/user/name", validateToken, profileDB);
router.get("/api/user/application", validateToken, applicationDB);
router.post('/api/user/insertApplication', validateToken, validateApplication, insertApplicationDB);

module.exports = router;