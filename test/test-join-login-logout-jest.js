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
const dummy = new User({ userName: 'Arthur', password: '123456', islogin: false, isAcknowledge: false });
const goofy = new User({ username: 'Ritvik', password: 'abc123', islogin: false, isAcknowledge: false });
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



// try to login an existing user
test("Can login a user", (done) => {
    agent.put(HOST + '/users/dummy/online').send(dummy).end(function (err, res) {
        expect(err).not.toBe(null);
        expect(res.statusCode).toBe(200);

        agent.get(HOST + '/users').send().end(function (err, res) {
            let users = res.body;
            let arthur = users.find((u) => u.userName === dummy.userName);
            expect(arthur.islogin).toBe(true);
            done();
        })
    })
})




// try to make acknowledgement for a user
test("Can acknowledge a user", (done) => {
    agent.put(HOST + '/users/dummy/acknowledgement').send().end(function (err, res) {
        expect(res.statusCode).toBe(302);
        done();
    })
})




// user login and check online status
test("Can get a user's online status", (done) => {
    agent.put(HOST + '/users/dummy/online').send(dummy).end(function (err, res) {
        expect(res.statusCode).toBe(200);

        agent.get(HOST + 'users/dummy/online').send().end(function (err, res) {
            let users = res.body;
            let arthur = users.find((u) => u.userName === dummy.userName);
            expect(arthur.islogin).toBe(dummy.islogin);
            done();
        });
        
    });

});



// try register with reserved username
test('Should reject post with invalid username with right response code', (done) => {
    agent.post(HOST + '/users')
        .send(silly)
        .end(function (err, res) {
            expect(err).not.toBe(null);
            expect(res.statusCode).toBe(401);
            done();
        });
});



// try register with too short password
test('Should reject post with invalid password with right response code', (done) => {
    agent.post(HOST + '/users')
        .send(folly)
        .end(function (err, res) {
            expect(err).not.toBe(null);
            expect(res.statusCode).toBe(402);
            done();
        });
});



// try to logout a user who was initially online
test("Can logout a user", (done) => {
    agent.put(HOST + '/users/dummy/offline').send().end(function (err, res) {
        expect(res.statusCode).toBe(200);
        done();
    })

});



// try to retrieve all users
test('Can retrieve all users', (done) => {
    agent.post(HOST + '/users').send(goofy).end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(201);

        agent.get(HOST + '/users').send().end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);

            let users = res.body;
            expect(users).toContainEqual({
                username: 'Arthur',
                password: '123456',
                islogin: true,
                isAcknowledge: true
            });
            expect(users).toContainEqual({
                username: 'Ritvik',
                password: 'abc123',
                islogin: true,
                isAcknowledge: true
            });

            done();
        });

    });

});














