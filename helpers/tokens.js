const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
    // const expiresIn = 10;
    let payload = {
        username: user.username,
        isAdmin: true
    };

    // return jwt.sign(payload, SECRET_KEY, { expiresIn });
    return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };