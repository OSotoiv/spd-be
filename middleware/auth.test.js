"use strict";
process.env.NODE_ENV = 'test';
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const db = require("../db");
const {
    authenticateJWT,
    ensureLoggedIn,
    isAdmin,
    ensureCorrectUserOrAdmin,
} = require("./auth");


const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ username: "test", isAdmin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: false }, "wrong");
beforeAll(async () => {
    await db.query(
        `INSERT INTO tech (username, password)
        VALUES
            ('test', 'password1'),
            ('test', 'password2');`
    )
})

afterAll(async () => {
    await db.query('DELETE FROM tech_instruments')
    await db.query('DELETE FROM tech')
    await db.query('DELETE FROM instrument')
    await db.query('DELETE FROM manufacturer')
    await db.end();
});

describe("authenticateJWT", function () {
    test("works: via header", function () {
        expect.assertions(2);
        const req = { headers: { authorization: `Bearer ${testJwt}` } };
        const res = { locals: {} };
        const next = function (err) {
            expect(err).toBeFalsy();
        };
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({
            user: {
                iat: expect.any(Number),
                username: "test",
                isAdmin: false,
            },
        });
    });

    test("works: no header", function () {
        expect.assertions(2);
        const req = {};
        const res = { locals: {} };
        const next = function (err) {
            expect(err).toBeFalsy();
        };
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({});
    });

    test("works: invalid token", function () {
        expect.assertions(2);
        const req = { headers: { authorization: `Bearer ${badJwt}` } };
        const res = { locals: {} };
        const next = function (err) {
            expect(err).toBeFalsy();
        };
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({});
    });
});


describe("ensureLoggedIn", function () {
    test("works", function () {
        expect.assertions(1);
        const req = {};
        const res = { locals: { user: { username: "test", is_admin: false } } };
        const next = function (err) {
            expect(err).toBeFalsy();
        };
        ensureLoggedIn(req, res, next);
    });

    test("unauth if no login", function () {
        expect.assertions(1);
        const req = {};
        const res = { locals: {} };
        const next = function (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        };
        ensureLoggedIn(req, res, next);
    });
});


describe("isAdmin", function () {
    test("works", function () {
        expect.assertions(1);
        const req = {};
        const res = { locals: { user: { username: "test", isAdmin: true } } };
        const next = function (err) {
            expect(err).toBeFalsy();
        };
        isAdmin(req, res, next);
    });

    test("unauth if not admin", function () {
        expect.assertions(1);
        const req = {};
        const res = { locals: { user: { username: "test", isAdmin: false } } };
        const next = function (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        };
        isAdmin(req, res, next);
    });

    test("unauth if anon", function () {
        expect.assertions(1);
        const req = {};
        const res = { locals: {} };
        const next = function (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        };
        isAdmin(req, res, next);
    });
});


describe("ensureCorrectUserOrAdmin", function () {
    test("works: admin", function () {
        expect.assertions(1);
        const req = { params: { username: "test" } };
        const res = { locals: { user: { username: "admin", isAdmin: true } } };
        const next = function (err) {
            expect(err).toBeFalsy();
        };
        ensureCorrectUserOrAdmin(req, res, next);
    });

    test("works: same user", function () {
        expect.assertions(1);
        const req = { params: { username: "test" } };
        const res = { locals: { user: { username: "test", isAdmin: false } } };
        const next = function (err) {
            expect(err).toBeFalsy();
        };
        ensureCorrectUserOrAdmin(req, res, next);
    });

    test("unauth: mismatch", function () {
        expect.assertions(1);
        const req = { params: { username: "wrong" } };
        const res = { locals: { user: { username: "test", isAdmin: false } } };
        const next = function (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        };
        ensureCorrectUserOrAdmin(req, res, next);
    });

    test("unauth: if anon", function () {
        expect.assertions(1);
        const req = { params: { username: "test" } };
        const res = { locals: {} };
        const next = function (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        };
        ensureCorrectUserOrAdmin(req, res, next);
    });
});