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
const dummy = new User({userName: 'Arthur', password: 'vwy207', islogin: true, isAcknowledge: true});
var goofy = { username: 'Ritvik', password: 'vwy207', status: Status.OK };
var silly = { username: 'access', password: 'xyz124' };
var folly = { username: 'Jane', password: 'aa' };



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
    agent.post(HOST + '/users').send(dummy).end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(201);

            agent.get(HOST + '/users')
                .send()
                .end(function (err, res) {
                    expect(err).toBe(null);
                    let users = res.body;
                    let arthur = users.find((u) => u.userName === dummy.userName);
                    expect(arthur.userName).toBe(dummy.userName);
                    done();
                });
        });
});



test('Should reject post with invalid username with right response code', (done) => {
    agent.post(HOST + '/users')
        .send(silly)
        .end(function (err, res) {
            expect(err).not.toBe(null);
            expect(res.statusCode).toBe(401);
            done();
        });
});



test('Should reject post with invalid password with right response code', (done) => {
    agent.post(HOST + '/users')
        .send(folly)
        .end(function (err, res) {
            expect(err).not.toBe(null);
            expect(res.statusCode).toBe(402);
            done();
        });
});















