const pool = require("./pool");

async function getAllUsers() {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows
}

async function getAllMessages() {
    const { rows } = await pool.query(`
        SELECT
            messages.id,
            messages.title,
            messages.content,
            messages.timestamp,
            users.first_name,
            users.last_name,
            users.username
        FROM messages
        JOIN users
        ON messages.user_id = users.id
        ORDER BY messages.timestamp DESC
    `);

    return rows;
}

async function createUser({ firstName, lastName, username, password }) {
    await pool.query(
        `
        INSERT INTO users (first_name, last_name, username, password)
        VALUES ($1, $2, $3, $4)
        `,
        [firstName, lastName, username, password]
    );
}

async function createMessage({ title, content, userId }) {
    await pool.query(
        `
        INSERT INTO messages (title, content, user_id)
        VALUES ($1, $2, $3)
        `,
        [title, content, userId]
    );
}

async function upgradeMembership(userId) {
    await pool.query(
        `UPDATE users
         SET membership_status = 'member'
         WHERE id = $1`,
        [userId]
    );
}

async function deleteMessage(messageId) {
    await pool.query(
        "DELETE FROM messages WHERE id = $1",
        [messageId]
    );
}

module.exports = { 
    getAllUsers,
    getAllMessages,
    createUser,
    createMessage,
    upgradeMembership,
    deleteMessage
}