const server = require("../src/app.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const mocLogger = require('mocha-logger');


const userModel = require("../models/user.js");
const taskModel = require("../models/task.js");

chai.use(chaiHttp);

describe("Server requests", function () {
    let taskId;
    let userToken;
    before(async function () {
        this.timeout(5000);
        await userModel.deleteMany({});
        await taskModel.deleteMany({});
    });

    it("signup user1 validation error", function (done) {
        this.timeout(10000);
        chai.request(server)
            .post("/users")
            .send({
                "name": "Lola",
                "age": 13,
                "email": "lola@gmail.com",
                "password": "1221p"
            })
            .end((err, res) => {
                expect(res).to.have.status(403);
                done();
                mocLogger.log(res.body.error);
            });
    });
    it("signup user1 success", function (done) {
        this.timeout(10000);
        chai.request(server)
            .post("/users")
            .send({
                "name": "Rory",
                "age": 36,
                "email": "rory@gmail.com",
                "password": "12345678"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.user).to.have.property("_id");
                done();
                mocLogger.log(JSON.stringify(res.body.user));
            });
    });
    it("signup user2 success", function (done) {
        this.timeout(10000);
        chai.request(server)
            .post("/users")
            .send({
                "name": "Marisa",
                "age": 67,
                "email": "lol@gmail.com",
                "password": "987654321"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.user).to.have.property("_id");
                done();
                mocLogger.log(JSON.stringify(res.body.user));
            });
    });
    it("authorization user1 success", function (done) {
        this.timeout(10000);
        chai.request(server)
            .post('/users/login')
            .send(
                {
                    "email": "rory@gmail.com",
                    "password": "12345678"
                })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.contain("success");
                userToken = res.body.token;
                done();
                mocLogger.log(res.body.message);
            });
    });
    it("adding task1 success", function (done) {
        this.timeout(10000);
        chai.request(server)
            .post('/tasks')
            .auth(userToken, {type: 'bearer'})
            .send(
                {
                    "title": "Taskkkkk",
                    "description": "Slay girl task!"
                })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.task).to.have.property("_id");
                taskId = res.body.task._id;
                done();
                mocLogger.log(JSON.stringify(res.body.task));
            });
    });
    it("adding task2 success", function (done) {
        this.timeout(10000);
        chai.request(server)
            .post('/tasks')
            .auth(userToken, {type: 'bearer'})
            .send(
                {
                    "title": "Mega hard task",
                    "description": "Just keeping it together :)"
                })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.task).to.have.property("_id");
                done();
                mocLogger.log(JSON.stringify(res.body.task));
            });
    });
    it("get tasks user1 success", function (done) {
        this.timeout(10000);
        chai.request(server)
            .get('/tasks')
            .auth(userToken, {type: 'bearer'})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.tasks).to.have.lengthOf(2);
                done();
                mocLogger.log(JSON.stringify(res.body.tasks));
            });
    });
    it("get task1 by id success", function (done) {
        this.timeout(10000);
        chai.request(server)
            .get(`/tasks/${taskId}`)
            .auth(userToken, {type: 'bearer'})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.task).to.have.property("title");
                expect(res.body.task).to.have.property("completed");
                done();
                mocLogger.log(JSON.stringify(res.body.task));
            });
    });
    it("logout user1 success", function (done) {
        this.timeout(10000);
        chai.request(server)
            .post('/users/logout')
            .auth(userToken, {type: 'bearer'})
            .end((err, res) => {
                expect(res).to.have.status(200);
                userToken = null;
                expect(res.body.message).to.contain("logout success");
                done();
                mocLogger.log(JSON.stringify(res.body.message));
            });
    });
    it("authorization user2 success", function (done) {
        this.timeout(10000);
        chai.request(server)
            .post('/users/login')
            .send(
                {
                    "email": "lol@gmail.com",
                    "password": "987654321"
                })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.contain("success");
                userToken = res.body.token;
                done();
                mocLogger.log(res.body.message);
            });
    });
    it("adding task3 success", function (done) {
        this.timeout(10000);
        chai.request(server)
            .post('/tasks')
            .auth(userToken, {type: 'bearer'})
            .send(
                {
                    "title": "Number 3",
                    "description": "So many tasks!"
                })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.task).to.have.property("_id");
                done();
                mocLogger.log(JSON.stringify(res.body.task));
            });
    });
    it("get tasks user2 success", function (done) {
        this.timeout(10000);
        chai.request(server)
            .get('/tasks')
            .auth(userToken, {type: 'bearer'})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.tasks).to.have.lengthOf(1);
                done();
                mocLogger.log(JSON.stringify(res.body.tasks));
            });
    });
    it("get task1 by id fail", function (done) {
        this.timeout(10000);
        chai.request(server)
            .get(`/tasks/${taskId}`)
            .auth(userToken, {type: 'bearer'})
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.message).to.contain("Not Found");
                done();
                mocLogger.log(JSON.stringify(res.body.message));
            });
    });
    it("logout user2 success", function (done) {
        this.timeout(10000);
        chai.request(server)
            .post('/users/logout')
            .auth(userToken, {type: 'bearer'})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.contain("logout success");
                userToken = null;
                done();
                mocLogger.log(JSON.stringify(res.body.message));
            });
    });
    it("get task1 by id fail", function (done) {
        this.timeout(10000);
        chai.request(server)
            .get(`/tasks/${taskId}`)
            .auth(userToken, {type: 'bearer'})
            .end((err, res) => {
                expect(res).to.have.status(403);
                expect(res.body.error).to.contain("Forbidden Access");
                done();
                mocLogger.log(JSON.stringify(res.body.error));
            });
    });
});

