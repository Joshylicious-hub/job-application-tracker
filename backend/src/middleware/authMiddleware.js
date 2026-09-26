const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {

    const token = req.cookies.accessToken;

    if(!token) {
        return res.status(401).json({
            message: "User does not have a token to access."
        });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
        if(err) {
            return res.status(401).json({
                message: "User does not have token."
            });
        }

        req.user = result;

        next();
    })
}

function validateLogin(req, res, next) {

    const { email, password } = req.body;

    if(!email || !password ) {
        return res.status(400).json({
            message: "Please complete the fields to continue."
        });
    }

    next();
}

function validateRegistration(req, res, next) {

    const { email, password, firstName, lastName } = req.body;

    if(!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            message: "Please complete the registration to continue."
        })
    }

    if(password.length < 8) {
        return res.status(400).json({
            message: "Password should be atleast 8 characters."
        });
    }

    next();
}

function validateApplication(req, res, next) {

    const { company, position, status, dateApplied, step} = req.body;

     if(!company || !position || !status || !dateApplied || !step) {
         return res.status(400).json({
            message: "Please complete the fields to continue"
        })
    }

    next();
}

module.exports = {
    validateLogin, validateRegistration, validateToken, validateApplication
}