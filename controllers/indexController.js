const db = require("../db/queries");

async function getHomePage(req, res) {
    const users = await db.getAllUsers();
    const messages = await db.getAllMessages();

    console.log(users)
    console.log(messages)
    
    res.render("index", { users, messages });
}

module.exports = {
    getHomePage
}