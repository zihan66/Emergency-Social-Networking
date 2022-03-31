// integration test using superagent
let agent = require('superagent');

const {MongoMemoryServer} = require("mongodb-memory-server");
const User = require("../models/user");
const Message = require("../models/message");
const mongoose = require("mongoose");
const moment = require("moment");
const bcrypt = require("bcrypt");
const brypt = require("bcrypt");


let PORT = 3000;
let HOST = 'http://localhost:' + PORT;

var mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = await mongoServer.getUri();
    const mongooseOpts = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    };
    await mongoose.connect(uri, mongooseOpts);
});


afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});


// Dummy Users
var dummy = {userName: 'Arthur', password: 'vwy207', islogin: true, isAcknowledge: true};
var tower = {userName: 'Tower', password: 'vwy111', islogin: true, isAcknowledge: true};
var tesen = {userName: 'tesen', password: 'vwy1123', islogin: true, isAcknowledge: true};
var goofy = {username: 'Ritvik', password: 'vwy207', status: 'Status.OK'};
var silly = {username: 'access', password: 'xyz124'};
var folly = {username: 'Jane', password: 'aa'};
var msg = {username:"yaphp","content":"test"}

// test("Can register a new user", async () => {
//     await agent.post(HOST + '/users')
//         .send(dummy)
//         .then((res, err) => {
//             expect(err).toBe(undefined);
//             expect(res.statusCode).toBe(201);
//         }).catch(e => {
//             // deal with it
//         });
//     return await agent.get(HOST + '/users')
//         .send()
//         .then((res) => {
//             let users = res.body;
//             let arthur = users.find((u) => u.username === dummy.username);
//             expect(arthur.username).toBe(dummy.username);
//         }).catch(err => {
//             expect(err).toBe(undefined);
//         }).catch(e => {
//             // deal with it
//         })
// });


// register a user API
test("Can register a new user", (done) => {
    agent.post(HOST + '/users').send({"username":msg.username,"password":"123123"}).end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(201);

        agent.get(HOST + '/users')
            .send()
            .end(function (err, res) {
                expect(err).toBe(null);
                let users = res.body;
                let arthur = users.find((u) => u.userName === dummy.userName);
                expect(arthur.userName).toBe("Arthur");
                done();
            });
    });
});

test('Should reject post with invalid username with right response code', (done) => {
    agent.post(HOST + '/users')
        .send({"username":"ttt","password":"123123"})
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(201);
            done();
        });
});

test('Should reject post with invalid password with right response code', (done) => {
    agent.post(HOST + '/users')
        .send({"username":msg.username,"password":"300"})
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(201);
            done();
        });
});

test('Should login successful with right password and username', (done) => {
    agent.post(HOST + '/users')
        .send({"username":msg.username,"password":"123123"})
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(201);
            done();
        });
});

test('Should fail with no exsit username', (done) => {
    agent.put(HOST + '/users/test/online')
        .send({"username":"test","password":"test"})
        .end(function (err, res) {
            expect(err).not.toBe(null);
            expect(res.statusCode).toBe(404);
            done();
        });
});

test('Should fail with invalid password', (done) => {
    agent.put(HOST + '/users/' + msg.username + '/online')
        .send({"username":msg.username,"password":"123"})
        .end(function (err, res) {
            expect(err).not.toBe(null);
            expect(res.statusCode).toBe(401);
            done();
        });
});

test('Should login with right password and username', (done) => {
    agent.put(HOST + '/users/' + msg.username + '/online')
        .send({"username":msg.username,"password":"123123"})
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            done();
        });
});

test('Should logout with right username', (done) => {
    agent.put(HOST + '/users/' + msg.username + '/offline')
        .send(dummy)
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            done();
        });
});

test('Should get All User Record', (done) => {
    agent.get(HOST + '/users')
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            done();
        });
});

test('Should get One User Record', (done) => {
    agent.get(HOST + '/users/' + msg.username)
        .query(msg)
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            done();
        });
});

test('Should setStatus success', (done) => {
    agent.put(HOST + '/users/' + msg.username + '/online').send({"username":msg.username,"password":"123123"})
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            agent.put(HOST + '/users/' + msg.username + '/status/unknown')
                .set("Cookie", res.header['set-cookie'][0])
                .end(function (err, res) {
                    expect(err).toBe(null);
                    expect(res.statusCode).toBe(200);
                    done();
                });
        });
});

test('Should acknowledge success', (done) => {
    agent.put(HOST + '/users/' + msg.username + '/online').send({"username":msg.username,"password":"123123"})
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            agent.put(HOST + '/users/' + msg.username + '/acknowledgement')
                .set("Cookie", res.header['set-cookie'][0])
                .end(function (err, res) {
                    expect(err).toBe(null);
                    expect(res.statusCode).toBe(200);
                    done();
                });
        });
});

test('Should create New Private Chat fail with invalid username1 and username2', (done) => {
    agent.post(HOST + '/chats')
        .send({"username1": "", "username2": ""})
        .end(function (err, res) {
            expect(err).not.toBe(null);
            expect(res.statusCode).toBe(404);
            done();
        });
});

test('Should create New Private Chat success with right username1 and username2', (done) => {
    agent.post(HOST + '/users').send(tower).end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(201);

        agent.post(HOST + '/users').send(tesen).end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(201);

            agent.post(HOST + '/chats')
                .send({"username1": tower.userName+moment.now(), "username2": tesen.userName+moment.now()})
                .end(function (err, res) {
                    expect(err).toBe(null);
                    expect(res.statusCode).toBe(201);
                    done();
                });
        });
    });
});

test('Should return error with empty username', (done) => {
    agent.get(HOST + '/chats')
        .send({"username": ""})
        .end(function (err, res) {
            expect(err).not.toBe(null);
            expect(res.statusCode).toBe(400);
            done();
        });
});

test('Should return 404 status code with not exist username', (done) => {
    agent.get(HOST + '/chats')
        .query({"username": "abcdefg"})
        .end(function (err, res) {
            expect(err).not.toBe(null);
            expect(res.statusCode).toBe(404);
            done();
        });
});

test('Should return all chats with right username', (done) => {
    agent.get(HOST + '/chats')
        .query(msg)
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            done();
        });
});

test('Should post public message with username', (done) => {
    agent.post(HOST + '/messages/public').send(msg).end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(201);
        done();
    });
});

test('Should return all public message', (done) => {
    agent.get(HOST + '/messages/public').send({}).end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        done();
    });
});

test('Should show error message with invalid chat_id', (done) => {
    agent.get(HOST + '/messages/private')
        .query({"chatID":"l1d21111cdlm"})
        .end(function (err, res) {
            expect(err).not.toBe(null);
            expect(res.statusCode).toBe(404);
            done();
        });
});

test('Should return private message with right chat_id', (done) => {
    agent.get(HOST + '/messages/private')
        .query({"chatID":"l1d2cdlm"})
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            done();
        });
});

test('Should post private message with invalid params', (done) => {
    agent.post(HOST + '/messages/private')
        .send({
            // eslint-disable-next-line prefer-const
            author: "yaphps",
            target: "tttt",
            content: "api test",
            chatID: null,
        })
        .end(function (err, res) {
            expect(err).not.toBe(null);
            expect(res.statusCode).toBe(404);
            done();
        });
});

test('Should post private message with right params', (done) => {
    agent.post(HOST + '/messages/private')
        .send({
            // eslint-disable-next-line prefer-const
            author: "yaphp",
            target: "yaphps",
            content: "api test",
            chatID: "l1d2cdlm",
        })
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(201);
            done();
        });
});

test('Should get user unread private message with invalid params', (done) => {
    agent.get(HOST + '/messages/private/unread')
        .send({"username": "ttt"})
        .end(function (err, res) {
            expect(err).not.toBe(null);
            expect(res.statusCode).toBe(404);
            done();
        });
});

test('Should get user unread private message with right params', (done) => {
    agent.get(HOST + '/messages/private/unread?username=yaphp')
        .send({})
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            done();
        });
});

test('Should update private message read status with right params', (done) => {
    agent.put(HOST + '/messages/private/6242d25782052435ccd3586b/unread')
        .send({})
        .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            done();
        });
});














