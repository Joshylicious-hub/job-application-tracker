const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function loginDB(req, res) {

    try {

        const { email, password } = req.body;

        const [result] = await db.query("SELECT * FROM login WHERE email = ?", [ email ]);

        if(result.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).json({
                message: "Email or password does not match in the records."
            })
        }

        const token = jwt.sign(
        {
            id: user.id, email: user.email
        },
        process.env.SECRET_KEY,
        {
            expiresIn: "10m"
        }
        );

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 10 * 60 * 1000
        });

        res.status(200).json({
            message: "User has successfully logged in"
        })

    }catch(err) {

        return res.status(500).json({
            message: `Login Error: ${err.message}`
        })

    }
}

async function registerDB(req, res) {

    try {

        const { email, password, firstName, lastName } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query("SELECT * FROM login WHERE email = ?", [ email ]);

        if(result.length > 0) {
            return res.status(409).json({
                message: "Email already exist."
            });
        }

        const [user] = await db.query("INSERT INTO login (email, password, first_name, last_name) VALUES(?, ?, ?, ?)",
            [ email, hashPassword, firstName, lastName]
        );

        res.status(201).json({
            message: `${user.affectedRows} user has been created`
        });

    }catch(err) {

        return res.status(500).json({
            message: `Register Error: ${err.message}`
        })

    }
}

async function profileDB(req, res) {

    try {

        const id = req.user.id;

        const [result] = await db.query("SELECT * FROM login WHERE id = ?", [ id ]);

        if(result.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.status(200).json({
            firstName: result[0].first_name,
            lastName: result[0].last_name
        })

    }catch(err) {
        return res.status(500).json({
            message: `Profile Error: ${err.message}`
        })
    }

}

async function applicationDB(req, res) {

    try {

        const id = req.user.id;

        const [result] = await db.query("SELECT * FROM applications WHERE foreign_id = ?", [ id ]);

        res.status(200).json(result);

    }catch(err) {
        return res.status(500).json({
            message: `Application Error: ${err.message}`
        })
    }
}

async function insertApplicationDB(req, res) {

    const id = req.user.id;

    const { company, position, status, dateApplied, step} = req.body;

    const [result] = await db.query("INSERT INTO applications (foreign_id, company, position, status, date, step) VALUES (?, ?, ?, ?, ?, ?)", 
        [ id, company, position, status, dateApplied, step]
    );

    res.status(201).json({
        message: `${result.affectedRows} application has been recorded.`
    })
}

module.exports = {
    loginDB, registerDB, profileDB, applicationDB, insertApplicationDB
};