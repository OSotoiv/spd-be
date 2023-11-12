"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");
const User = require("../models/User")


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

async function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            const user = jwt.verify(token, SECRET_KEY);
            if (await User.userExist(user.username)) {
                res.locals.user = user;
                return next();
            } else {
                throw new UnauthorizedError()
            }
        }
        //though an error was thrown here we still move on to next no matter what.
        throw new UnauthorizedError()
    } catch (err) {
        return next();
    }
}

//check if user is an Admin
function isAdmin(req, res, next) {
    try {
        if (res.locals.user && res.locals.user.isAdmin) {
            return next();
        }
        throw new UnauthorizedError();
    } catch (err) {
        return next(err);
    }
}
module.exports = {
    authenticateJWT,
    isAdmin
};