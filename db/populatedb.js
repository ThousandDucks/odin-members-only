const { Client } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const dropTables = `DROP TABLE IF EXISTS messages;
                    DROP TABLE IF EXISTS users;`;

const createUsers = 
    `CREATE TABLE users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        membership_status VARCHAR(100) NOT NULL DEFAULT 'standard'
    );
    `;

const createMessages = 
    `CREATE TABLE messages(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES users(id)
        );
        `;

const createUserData =
    `INSERT INTO users(
        first_name, last_name, username, password, membership_status
    )
    VALUES
    ($1, $2, $3, $4, $5),
    ($6, $7, $8, $9, $10);
    `;

const createMessageData =
    `INSERT INTO messages(
    user_id, title, content)
    VALUES
    (1, 'My First Post', 'Hello, world!'),
    (2, 'Admin Notice', 'Welcome. Please follow the rules:

    1. Be respectful to other members.
    2. No spam or repeated messages.
    3. Keep discussions appropriate for all users.'
    );
    `

async function main() {
    console.log("seeding...")

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    await client.connect();
    await client.query(dropTables);
    await client.query(createUsers);
    await client.query(createMessages);
    
    const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const johnHash = await bcrypt.hash(process.env.JOHN_PASSWORD, 10);

    await client.query(createUserData, [
        "John", "Smith", "john@example.com", johnHash, "standard",
        "Admin", "User", "admin@example.com", adminHash, "admin"
    ]);

    await client.query(createMessageData);
    await client.end();
    console.log("Done.");
}

main();