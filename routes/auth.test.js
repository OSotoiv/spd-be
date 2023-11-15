"use strict";
process.env.NODE_ENV = 'test';
const request = require("supertest");
const app = require("../app");
// const {
//     commonBeforeAll,
//     commonBeforeEach,
//     commonAfterEach,
//     commonAfterAll,
//   } = require("./_testCommon");

//   beforeEach(commonBeforeEach);
//   afterEach(commonAfterEach);
//   afterAll(commonAfterAll);
const { commonBeforeAll, commonAfterEach, commonAfterAll } = require("./_common_testSetup")
beforeAll(commonBeforeAll);
// beforeEach(() => { });//not using
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/token */

describe("POST /auth/token", function () {
    test("gets back token when CORRECT username and password used", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
                username: "user_!Admin",
                password: "password123",
            });
        expect(resp.body).toEqual({
            "token": expect.any(String),
        });
    });

    test("unauth with non-existent user", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
                username: "no-such-user",
                password: "password123",
            });
        expect(resp.statusCode).toEqual(404);
    });

    test("unauth with wrong password", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
                username: "user_!Admin",
                password: "wrongPassword",
            });
        expect(resp.statusCode).toEqual(401);
    });

    test("bad request with missing data", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
                username: "user_!Admin",
            });
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
                username: 42,
                password: "above-is-a-number",
            });
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
    test("works for anon", async function () {
        const resp = await request(app)
            .post("/auth/register")
            .send({
                username: "newUser",
                password: "password"
            });
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            "token": expect.any(String),
        });
    });
    test("still gets token when CORRECT username and password used", async function () {
        const resp = await request(app)
            .post("/auth/token")
            .send({
                username: "newUser",
                password: "password",
            });
        expect(resp.body).toEqual({
            "token": expect.any(String),
        });
    });
    test("bad request with missing fields", async function () {
        const resp = await request(app)
            .post("/auth/register")
            .send({
                username: "newUser",
            });
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/auth/register")
            .send({
                username: "new",
                firstName: "first",
                lastName: "last",
                password: "password",
                email: "not-an-email",
            });
        expect(resp.statusCode).toEqual(400);
    });
});
