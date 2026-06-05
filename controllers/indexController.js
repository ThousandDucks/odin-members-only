const db = require("../db/queries");

async function getAllMessages(req, res) {
    const messages = await db.getAllMessages();
    const users = await db.getAllUsers();

    console.log(messages);
    console.log("====");
    console.log(req.user);
    console.log("===");
    console.log(users);
    res.render("index", { messages });
}

async function newMessageGet(req, res) {
    res.render("new-message");
}

async function newMessagePost(req, res, next) {
    try {
        const { title, content } = req.body;

        await db.createMessage({
            title,
            content,
            userId: req.user.id
        });

        res.redirect("/");
    } catch (err) {
        next(err);
    }
}

async function ensureLoggedIn(req, res, next) {
    if (!req.user) {
        return res.redirect("/log-in");
    }
    next();
}

async function membershipGet(req, res) {
    res.render("membership", {error: null, membershipStatus: req.user?.membership_status});
}

async function membershipPost(req, res, next) {
    try {
        const { answer } = req.body;

        const correctAnswer = "access";

        if (answer.trim().toLowerCase() !== correctAnswer) {
            return res.render("membership", {
                error: "Wrong answer. Try again."
            });
        }

        const userId = req.user.id;

        await db.upgradeMembership(userId);

        res.redirect("/");
    } catch (err) {
        next(err);
    }
}

async function deleteMessage(req, res, next) {
    try {
        if (!req.user || req.user.membership_status !== "admin") {
            return res.redirect("/");
        }

        const messageId = req.params.id;

        await db.deleteMessage(messageId);

        res.redirect("/");
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllMessages,
    newMessageGet,
    newMessagePost,
    ensureLoggedIn,
    membershipGet,
    membershipPost,
    deleteMessage
}