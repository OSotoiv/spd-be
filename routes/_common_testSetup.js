"use strict";
process.env.NODE_ENV = 'test';
const { createToken } = require("../helpers/tokens");
const db = require("../db.js");
const User = require("../models/User");
let userToken;
let adminToken;

async function commonBeforeAll() {
    // await db.query('BEGIN')
    await db.query("DELETE FROM tech_instruments");
    await db.query("DELETE FROM tech");
    await db.query("DELETE FROM instrument");
    await db.query("DELETE FROM manufacturer");
    const user1 = await User.register('user_!Admin', 'password123', false);
    const adminUser = await User.register('Admin_User', 'password777', true);
    userToken = createToken(user1);
    adminToken = createToken(adminUser)
}
async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    //IF YOU ROLLBACK YOU WILL NOT BE ABLE TO PERSIST DATA BETWEEN TEST
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    //CLOSE TO PREVENT ERRORS AND ALLOW JEST TO END
    await db.query("DELETE FROM tech_instruments");
    await db.query("DELETE FROM tech");
    await db.query("DELETE FROM instrument");
    await db.query("DELETE FROM manufacturer");
    await db.end();
}
module.exports = { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, userToken, adminToken }