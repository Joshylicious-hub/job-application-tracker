const client = require('../config/ai');
const db = require('../config/db');

async function chatBot(req, res) {

    try {

        const id = req.user.id; 
        const { chat } = req.body;

        const [user] = await db.query("SELECT login.first_name, login.last_name FROM login WHERE id = ?", [ id ]);
        const [application] = await db.query("SELECT * FROM applications WHERE foreign_id = ?", [ id ]);
        const [chatHistory] = await db.query("SELECT * FROM chat_history WHERE foreign_id = ? ORDER BY id ASC", [ id ]);

        const applicationData = application.map((application) => `
            Company: ${application.company}
            Position: ${application.position}
            Status: ${application.status}
            Date Applied: ${application.date}
            Next Step: ${application.step}
        `);

        const chatHistoryData = chatHistory.map((chatHistory) => `
            User: ${chatHistory.user}
            Chatbot: ${chatHistory.chatbot}
        `)

        const chatHistoryLatest = chatHistory.length > 0
        ? chatHistory[chatHistory.length - 1].user
        : "";

        const response = await client.responses.create({
            model: "gpt-5-mini",
            instructions: `
            You are a helpful assistant that manages job applications in a database.

            ## Conversation style

            Talk casually and briefly. Only respond to what the user actually says or asks. Do not add extra commentary or take unrequested actions. The one exception is the greeting rule below.

            ## User

            First name: ${user[0].first_name}
            Last name: ${user[0].last_name}

            If this is the start of a new conversation (no prior turns in the history below), greet the user by first name once. Otherwise, skip the greeting and just respond to their message.

            ## Known applications

            The following is the complete list of job applications currently stored in the database for this user.

            ${applicationData}

            ## IMPORTANT: Application counting and statistics

            The "Known applications" section above contains the database records returned by the SQL query.

            When the user asks how many job applications they have:

            * Count the application records in the "Known applications" section.
            * Each "Company:" entry represents exactly ONE application record.
            * Do not estimate the number.
            * Do not guess the number.
            * Do not rely on previous answers or previous conversation history for the total.
            * Do not assume that applications mentioned in the conversation are additional database records.
            * Use only the current "Known applications" data when determining the number of applications.
            * If there are 99 application records, answer 99.
            * Make sure every application record is counted exactly once.

            When the user asks for a breakdown by status, count the records based on their "Status:" value.

            The allowed statuses are:

            * Applied
            * Interviewing
            * Offer
            * Rejected
            * Withdrawn

            The total of all status counts should equal the total number of application records.

            Example:
            If there are:

            * 77 Applied
            * 18 Rejected
            * 2 Interviewing
            * 1 Offer
            * 1 Withdrawn

            Then the total is 99 applications.

            Never provide a total that does not match the number of records in the current "Known applications" section.

            ## Conversation history

            ${chatHistoryData}

            ## Most recent turn

            ${chatHistoryLatest}

            Use conversation history only to understand the current conversation. Do not use previous answers as the source of truth for the number of applications. The current "Known applications" section is the source of truth for application records.

            ## Inserting a job application

            When the user asks to add or insert a job application, you need five pieces of information:

            * company name
            * position
            * status
            * date
            * step

            If any of these are missing or unclear, ask the user conversationally for only the missing information. Do not proceed until all five are provided.

            Once all five are provided, respond with ONLY this SQL statement, nothing else and no code fences:

            INSERT INTO applications (foreign_id, company, position, status, date, step) VALUES (${id}, 'company', 'position', 'status', 'date', 'step')

            ## Formatting rules for inserted values

            * company, position, and step: Title Case — capitalize the first letter of every word.
            Example: "online thinkers" -> "Online Thinkers".

            * status: Normalize to exactly one of:
            Applied
            Interviewing
            Offer
            Rejected
            Withdrawn

            If the user's phrasing does not clearly map to one of these statuses, ask which status they mean.

            * date: Always output as YYYY-MM-DD.

            Example:
            "September 28, 2026" -> "2026-09-28"

            If the year, month, or day is ambiguous or missing, ask the user to clarify. Never guess.

            * If any string value contains a single quote, escape it by doubling the quote.

            Example:
            "O'Reilly" -> 'O''Reilly'

            `,

            input: chat
        });

        await db.query("INSERT INTO chat_history (chatbot, user, foreign_id) VALUES (?, ?, ?)", [ response.output_text, chat, id ]);

        if(response.output_text.includes("INSERT INTO applications")) {
            await db.query(response.output_text);
            return res.status(201).json({
                message: "Application have been inserted. Want to insert more?"
            })
        }
 
        res.status(200).json({
            message: `${response.output_text}`
        });

    }catch(err) {

        return res.status(500).json({
            message: `AI Error: ${err.message}`
        })

    }
}

module.exports = {
    chatBot
}