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
        //get user from data base
        const user = await db.query(
            `SELECT username, password, is_admin AS "isAdmin" FROM tech WHERE username = $1`,
            [username]
        )
        // compare hashed password to a new hash from password
        const tech = user.rows[0];
        if (!tech) {
            throw new NotFoundError();
        }
        const validPassword = await bcrypt.compare(password, tech.password);
        if (validPassword) {
            delete tech.password;
            return tech;
        }
        throw new UnauthorizedError('inside auth');
    }

    static async userExist(username) {
        const user = await db.query(`SELECT * FROM tech WHERE username = $1`, [username]);
        if (user.rows[0]) {
            return true;
        }
        return false;
    }

    static async register(username, password) {

        const duplicateCheck = await db.query(
            `SELECT username
           FROM tech
           WHERE username = $1`,
            [username],
        );
        //check if username already exist
        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO tech
           (username,
            password)
           VALUES ($1, $2)
           RETURNING username, is_admin AS isAdmin`,
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