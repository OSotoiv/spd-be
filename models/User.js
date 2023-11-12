"use strict";
const bcrypt = require("bcrypt");
const { HASHED_WORD, SECRET_KEY } = require("../config");


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

}


module.exports = User;