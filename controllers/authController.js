const bcrypt = require("bcryptjs");
const db = require("../db/queries");

async function signUpGet(req, res) {
    res.render("sign-up", {error: null});
}

async function signUpPost(req, res, next) {
    try {
        const { firstName, lastName, username, password } = req.body;

        const errors = [];

        if (username.length < 3) {
            errors.push("Username must be at least 3 characters long");
        }

        if (password.length < 6) {
            errors.push("Password must be at least 6 characters long");
        }

        if (errors.length) {
            return res.render("sign-up", {
                error: errors.join(", ")
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.createUser({
            firstName,
            lastName,
            username,
            password: hashedPassword
        });

        res.redirect("/");

    } catch (err) {

        if (err.code === "23505") {
            return res.render("sign-up", {
                error: "Username already taken"
            });
        }

        next(err);
    }
}

async function logInGet(req, res) {
    res.render("log-in");
}

module.exports = {
    signUpGet,
    signUpPost,
    logInGet
};