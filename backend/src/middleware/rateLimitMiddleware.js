const rateLimit = require('express-rate-limit');

const limit = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    message: {
        message: "Too many request. Please try again later."
    },
    statusCode: 429,
    standardHeaders: "draft-8",
    legacyHeaders: false
})

module.exports = { limit };