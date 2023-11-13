"use strict";
const db = require("../db");
const bcrypt = require("bcrypt");
const { HASHED_WORD, SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

/** Related functions for users. */

class User {
    /** authenticate user with username, password.
     *
     * Returns { username, first_name, last_name, email, is_admin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/

    static async authenticate(username, password) {
        const validUser = SECRET_KEY === username;
        // compare hashed password to a new hash from password
        const validPassword = await bcrypt.compare(password, HASHED_WORD);

        if (validUser === true && validPassword === true) {
            return { username }
        }
        throw new UnauthorizedError('inside auth');
    }

    static async userExist(username) {
        //would usually check the database here but for sake of simplicity I have a hardcoded SECRET_KEY
        return username === SECRET_KEY
    }

    static async register(username, password) {

        const duplicateCheck = await db.query(
            `SELECT username
           FROM tech
           WHERE username = $1`,
            [username],
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO tech
           (username,
            password)
           VALUES ($1, $2)
           RETURNING username`,
            [
                username,
                hashedPassword
            ],
        );

        const user = result.rows[0];
        if (!user) {
            throw new BadRequestError("something went wrong")
        }
        return user;
    }


}


module.exports = User;