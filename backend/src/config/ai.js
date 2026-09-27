const OpenAI = require('openai');

const client = new OpenAI({
    apiKey: process.env.API_KEY
});

module.exports = client;