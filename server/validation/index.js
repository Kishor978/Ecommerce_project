const { validationResult } = require("express-validator");

//for running the express validation for validating the user data
const runValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorList = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorList });
    }
    next()
};

module.exports = runValidation;
