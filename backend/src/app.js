require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const OpenAI = require('openai');
const multer = require('multer');
const path = require('path');

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'https://job-application-tracker-six-iota-21.vercel.app',
    credentials: true
}));
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
})

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        console.log("Uploaded MIME type:", file.mimetype);
        console.log("Uploaded filename:", file.originalname);

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        const allowedExtensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".pdf",
            ".doc",
            ".docx"
        ];

        const extension = path.extname(file.originalname).toLowerCase();

        if (
            allowedTypes.includes(file.mimetype) ||
            (
                file.mimetype === "application/octet-stream" &&
                allowedExtensions.includes(extension)
            )
        ) {
            return cb(null, true);
        }

        return cb(
            new Error("Only JPG, PNG, WEBP, PDF, DOC and DOCX files are allowed")
        );
    }
});


const client = new OpenAI({
    apiKey: process.env.API_KEY
})

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

async function startServer() {
    try {
        
        const connection = await db.getConnection();

        console.log('Connected to jobapplication database');
        connection.release();

        app.listen(process.env.PORT, ()=> {
            console.log('Connected to http://localhost:3000');
        })

    }catch(err) {
        console.log(`Server error: ${err.message}`);
    }
}

function validateInput(req, res, next) {

    const { email, confirmEmail, password, confirmPassword } = req.body;

    if(!email || !confirmEmail || !password || !confirmPassword) {
        return res.status(400).json({
            message: "Complete the fields to register user."
        });
    }

    next();
}

function validateEmail(req, res, next) {

    const { email, confirmEmail } = req.body;

    if(email !== confirmEmail) {
        return res.status(400).json({
            message: "Email and confirm email does not match."
        });
    }

    next();
}

function validatePassword(req, res, next) {

    const { password, confirmPassword} = req.body;

    if(password !== confirmPassword) {
        return res.status(400).json({
            message: "Password and confirm password does not match."
        })
    }

    next();
}

app.post('/api/user/register', validateInput, validateEmail, validatePassword, async (req, res) => {


    try {

        const { email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query('SELECT * FROM login WHERE email = ?', [ email ]);

        if(result.length > 0) {
            return res.status(401).json({
                message: "User already exist"
            });
        }

    const [insert] = await db.query('INSERT INTO login (email, password) VALUES(?, ?)', [ email, hashPassword]);

    res.status(201).json({
            message: `${insert.affectedRows} has been created.`
    })

    }catch(err) {
        return res.status(500).json({
            message: `Error: ${err.message}`
        })
    }

})

const limit = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    message: {
        message: "Too many request. Please try again later."
    },
    statusCode: 429,
    standardHeaders: 'draft-8',
    legacyHeaders: false
});

function validateLogin(req, res, next) {

    const { email, password } = req.body;

    if(!email || !password ) {
        return res.status(400).json({
            message: "Email or password needs to be completed."
        })
    }

    next()
}

app.post('/api/user/login', limit, validateLogin, async (req, res) => {

    try {

        const { email, password } = req.body;

        const [result] = await db.query('SELECT * FROM login WHERE email = ?', [ email ]);

        if(result.length === 0) {
            return res.status(404).json({
                message: "User not found."
            })
        }

        const user = result[0];

        if(!await bcrypt.compare(password, user.password)) {
            return res.status(401).json({
                message: "Email or password does not match. Please try again."
            })
        }

        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.SECRET_KEY,
            {expiresIn: '20m'}
        )

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 20 * 60 * 1000
        })

        res.status(200).json({
            message: "Logged in successfully"
        })

    }catch(err) {
        return res.status(500).json({
            message: `Error: ${err.message}`
        })
    }

})

function validateToken(req, res, next) {

    const token = req.cookies.accessToken;

    if(!token) {
        return res.status(401).json({
            message: "User does not have a token."
        })
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
        if(err) {
            return res.status(500).json({
                message: `Token error: ${err.message}`
            })
        }

        req.user = result;

        next();
    })
}

function validateProfile(req, res, next) {

    const { firstName, lastName, age, education, location, number } = req.body;

    if(!firstName || !lastName || !age || !education || !location || !number) {
        return res.status(400).json({
            message: "User needs to complete the fields."
        })
    }

    next();
}

app.post('/api/user/profile', validateToken, validateProfile, async (req, res) => {

    try {

        const id = req.user.id;
        const { firstName, lastName, age, education, location, number } = req.body;

        const [result] = await db.query("SELECT * FROM profile WHERE foreign_id = ?", [ id ]);

        if(result.length > 0) {
            return res.status(403).json({
                message: "User already have profile"
            })
        }

        const insert = `INSERT INTO profile (foreign_id, first_name, last_name, age, education, location, number) VALUES(?, ?, ?, ?, ?, ?, ?)`;

        const [profile] = await db.query(insert, [ id, firstName, lastName, age, education, location, number]);

        res.status(201).json({
            message: `${profile.affectedRows} user profile has been created.`
        })

    }catch(err) {

        return res.status(500).json({
            message: `Error: ${err.message}`
        })

    }
})

app.get('/api/user/profile', validateToken, async (req, res) => {

    try {

        const id = req.user.id;

        const [result] = await db.query('SELECT * FROM profile WHERE foreign_id = ?', [ id ]);

        res.status(200).json(result);

    }catch(err) {

        return res.status(500).json({
            message: `Error: ${err.message}`
        })
    }
   
})

function validateApplication(req, res, next) {

    const { company, jobTitle, jobStatus } = req.body;

    if(!company || !jobTitle || !jobStatus) {
        return res.status(400).json({
            message: 'Please complete job application company, job title, job status.'
        })
    }

    next();
}

app.post('/api/user/application', validateToken, validateApplication, async(req, res) => {

    try {

        const id = req.user.id;
        const { company, jobTitle, jobStatus } = req.body;

        const [insert] = await db.query('INSERT INTO application (foreign_id, company, job_title, job_status) VALUES (?, ?, ? ,?)', [ id, company, jobTitle, jobStatus]);

        res.status(201).json({
            message: `${insert.affectedRows} has been created.`
        })

    }catch(err) {

        return res.status(500).json({
            message: `Error: ${err.message}`
        })
    }
})

app.get('/api/user/application', validateToken, async (req, res) => {

    try {

        const id = req.user.id;

        const [result] = await db.query('SELECT * FROM application WHERE foreign_id = ?', [ id ]);

        res.status(200).json(result);

    }catch(err) {
        return res.status(500).json({
            message: `Error: ${err.message}`
        })
    }
})

function validateMessage(req, res, next) {

    const { chat } = req.body;

    if(!chat) {
        return res.status(400).json({
            message: "Please input a message."
        })
    }

    next();
}

app.post('/api/user/openai', validateToken, validateMessage, async (req, res) => {

    const id = req.user.id;
    const { chat } = req.body;

    const [name] = await db.query('SELECT * FROM profile WHERE foreign_id = ?', [ id ]);

    const user = {
        name: `${name[0].first_name} ${name[0].last_name}`,
        age: name[0].age,
        education: name[0].education,
        location: name[0].location,
        number: name[0].number
    }

    const [application] = await db.query('SELECT * FROM application WHERE foreign_id = ?', [ id ]);

    const [chatbot] = await db.query('SELECT * FROM chatbot WHERE foreign_id = ?', [ id ]);


    const response = await client.responses.create({
        model: "gpt-5-mini",
        tools: [
            { type: "web_search" }
        ],
        instructions: `You are a job-application-tracking assistant. Use the data below to answer the user's questions and to manage their job application records via SQL.

        USER INFO:
        name: ${user.name}
        age: ${user.age}
        education: ${user.education}
        location: ${user.location}
        number: ${user.number}

        CURRENT JOB APPLICATIONS:
        ${application.map((jobapplications) => `
        Company: ${jobapplications.company}
        Job Title: ${jobapplications.job_title}
        Job Status: ${jobapplications.job_status}
        `).join('')}

        CONVERSATION HISTORY:
        ${chatbot.map((chatbot) => `
        User: ${chatbot.user}
        Bot: ${chatbot.bot}
        `).join('')}

         ===========================================
        JOB SEARCH RULES
        ===========================================

        If the user asks you to find, search for, or look for a job:

        1. If the user has NOT specified what type of job they want:
           - Ask the user what type of job they are looking for.
           - Do NOT perform a web search yet.

        2. If the user has already specified the type of job they want:
           - Use the web search tool to search for CURRENT job listings.
           - Search across multiple job websites, including:
             - JobStreet
             - Indeed
             - Bossjob
             - LinkedIn
             - Recruit
             - Other relevant job websites.

        3. Provide at least 5 relevant job listings whenever possible.

        4. For each job listing, provide:
           - Job title
           - Company name
           - Job website
           - Direct link to the actual job listing

        5. Do NOT provide only the homepage of a job website.
           The link should point directly to the specific job posting whenever possible.

        6. Only provide job listings that match the job type requested by the user.

        7. Consider the user's location when searching for jobs.
           Prefer jobs that are relevant to the user's location unless the user requests remote jobs,
           another location, or a different location.

        8. If fewer than 5 relevant jobs can be found, provide the jobs that were found.
           Never invent job listings, companies, or URLs.

        9. Clearly identify the source of each job listing.

        Example conversation:

        User: "Can you find me a job?"

        Assistant: "Sure. What type of job are you looking for?"

        User: "Junior Web Developer"

        Assistant:
        "Here are some current Junior Web Developer opportunities I found:

        1. Junior Web Developer — Company A
           JobStreet
           https://actual-job-link.com

        2. Junior Web Developer — Company B
           Indeed
           https://actual-job-link.com

        3. Junior Web Developer — Company C
           Bossjob
           https://actual-job-link.com

        4. Junior Web Developer — Company D
           LinkedIn
           https://actual-job-link.com

        5. Junior Web Developer — Company E
           Recruit
           https://actual-job-link.com"

        ===========================================
        GENERAL BEHAVIOR
        ===========================================
        - If the user asks a normal question (not a database action), answer it conversationally using the info above. Do not output SQL.
        - Only produce a SQL query when the user clearly wants to add, delete, or update a job application, and only after all required fields for that action have been collected (see below).
        - Track what's already been provided across the conversation. Never re-ask for information the user already gave, even if it was a few messages ago.
        - If the user gives a company name that does not match any entry in CURRENT JOB APPLICATIONS (for a delete or update), point this out and ask them to confirm or correct the company name before generating a query.
        - If a company name matches more than one entry in CURRENT JOB APPLICATIONS, ask the user to specify which one (e.g. by job title) before generating a query.

        ===========================================
        CAPITALIZATION RULE
        ===========================================
        Capitalize the first letter of each word in company names, job titles, and job statuses if the user provides them in lowercase.
        Example: "online thinkers" -> "Online Thinkers"

        ===========================================
        VALUE ESCAPING RULE
        ===========================================
        If a company name, job title, or job status contains a single quote/apostrophe (e.g. O'Brien Consulting), escape it by doubling it (O''Brien Consulting) before inserting it into the SQL string, so the query remains valid.

        ===========================================
        1. INSERT RULE
        ===========================================
        Required fields: company name, job title, job status.

        Do not generate SQL until all three are provided. Ask only for whichever fields are still missing.

        Example:
        User: "Add a new job application."
        Assistant: "Please provide the company name, job title, and job status."
        User: "The company is Online Thinkers."
        Assistant: "Please provide the job title and job status."
        User: "Junior Developer, Interviewing."

        Once all three are known, return ONLY:
        INSERT INTO application (foreign_id, company, job_title, job_status) VALUES(${id}, 'Online Thinkers', 'Junior Developer', 'Interviewing');

        ===========================================
        2. DELETE RULE
        ===========================================
        Required field: company name (disambiguated per the GENERAL BEHAVIOR rules above if needed).

        Example:
        User: "Delete job application."
        Assistant: "Please provide the company name to be deleted."
        User: "The company is Online Thinkers."

        Once provided, return ONLY:
        DELETE FROM application WHERE company = 'Online Thinkers' AND foreign_id = ${id};

        ===========================================
        3. UPDATE RULE
        ===========================================
        Required fields:
        1. Company name (disambiguated per the GENERAL BEHAVIOR rules above if needed)
        2. Which field to update: job status, job title, or both
        3. The new value(s) for whichever field(s) are being updated

        Do not generate SQL until the company name AND the new value(s) are known. Ask for whatever is missing.

        Example (status only):
        User: "Update a job application status."
        Assistant: "Please provide the company name and the new status."
        User: "Online Thinkers, Interviewing."

        Return ONLY:
        UPDATE application SET job_status = 'Interviewing' WHERE foreign_id = ${id} AND company = 'Online Thinkers';

        Example (title only):
        UPDATE application SET job_title = 'Senior Developer' WHERE foreign_id = ${id} AND company = 'Online Thinkers';

        Example (both, in one statement):
        UPDATE application SET job_title = 'Senior Developer', job_status = 'Offer' WHERE foreign_id = ${id} AND company = 'Online Thinkers';

        ===========================================
        OUTPUT FORMAT RULES (apply to all SQL responses)
        ===========================================
        - Never guess or invent missing information.
        - Never generate SQL if any required value for that action is missing — ask for it instead.
        - When all required values are present, output ONLY the raw SQL statement.
        - No explanations, no markdown code fences, no text before or after the query.
        - Replace placeholder values with the user-provided values, applying the capitalization and escaping rules above, wrapped in single quotes.
        - Do not use square brackets.
        `,
        input: chat
    });

    const botResponse = response.output_text;
    await db.query('INSERT INTO chatbot (foreign_id, user, bot) VALUES(?, ?, ?)', [ id, chat, botResponse ]);

    if(botResponse.includes('INSERT INTO application')) {

        try {

        await db.query(botResponse);

        return res.status(201).json({
            message: "Application has been inserted. You want me to insert more?"
        })

        }catch(err) {
            return res.status(500).json({
                message: `Query error: ${err.message}`
            })
        }
    }

    if(botResponse.includes('DELETE FROM application')) {

        try {

        await db.query(botResponse);

        return res.status(200).json({
            message: "Application has been deleted. You want me to delete more?"
        })

        }catch(err) {
            return res.status(500).json({
                message: `Query error: ${err.message}`
            })
        }
        
    }

    if(botResponse.includes('UPDATE application')) {

        try {

        await db.query(botResponse);

        return res.status(200).json({
            message: "Application has been updated. You want me to update more?"
        })

        }catch(err) {
            return res.status(500).json({
                message: `Query error: ${err.message}`
            })
        }
    
    }

    res.status(200).json({
        message: response.output_text
    });

})

app.post('/api/user/resume', validateToken, upload.single('resume'), async (req, res) => {

    try {

        const id = req.user.id;

         if (!req.file) {
            return res.status(400).json({
                message: "Please upload a resume file."
            });
        }

        const [result] = await db.query("SELECT * FROM resume WHERE foreign_id = ?", [ id ]);

        if(result.length > 0) {
            return res.status(409).json({
                message: "You already have resume uploaded."
            })
        }

        const [insert] = await db.query('INSERT INTO resume (foreign_id, resume) VALUES(?, ?)', [id, req.file.filename]);

        res.status(201).json({
            message: `${insert.affectedRows} resume has been created.`
        })

    }catch(err) {
        return res.status(500).json({
            message: `Error: ${err.message}`
        })
    }

    
    
})

startServer();