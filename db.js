"use strict";
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
    db = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
} else {
    db = new Client({
        user: process.env.DB_USER,
        host: 'localhost',
        database: getDatabaseUri(),
        password: process.env.DB_PASSWORD || "",
    });
}

db.connect();

module.exports = db;