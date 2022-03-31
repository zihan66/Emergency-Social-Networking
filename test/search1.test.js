let agent = require("superagent");
let app = require("../app");

require("dotenv").config();
const mongoose = require("mongoose");
const Socket = require("../socket");

let PORT = 3000;
let HOST = "http://localhost:" + PORT;
let connection;
var server;

beforeAll(async () => {
  server = await app.listen(PORT);
  Socket.setServer(server);
  await mongoose.connection.close();
  if (process.env.ENVIRONMENT === "DEV") {
    connection = mongoose.connect(process.env.DEV_TEST_DATABASE);
  } else {
    connection = mongoose.connect(process.env.TEST_DATABASE);
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await server.close();
});

const user001 = {
  username: "001",
  password: "1234",
  islogin: true,
  lastStatusCode: "OK",
  isAcknowledge: true,
};
const user002 = {
  username: "002",
  password: "1234",
  islogin: true,
  lastStatusCode: "OK",
  isAcknowledge: true,
};

// search user by status
test("Can search user by status", () => {
  return (async () => {
    await agent
      .post(HOST + "/users")
      .send(user001)
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
        done();
      })
      .catch((e) => {
        // deal with it
      });

    await agent
      .post(HOST + "/users")
      .send(user002)
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
        done();
      })
      .catch((e) => {
        // deal with it
      });

    await agent
      .get(HOST + "/search/users")
      .query({ status: "OK" })
      .then((err, res) => {
        expect(err).toBe(null);
        let users = res.body;
        expect(users).toContain({ userName: "001" });
        expect(users).toContain({ username: "002" });
        done();
      })
      .catch((e) => {});
  })().catch((e) => {
    // deal with chain fail
  });
});

// search username
// test("Can search user by name", async () => {
//     await agent.post(HOST + '/users').send(user001)
//         .then((res, err) => {
//             expect(err).toBe(undefined);
//             expect(res.statusCode).toBe(201);
//             done();
//         }).catch(e => {
//             // deal with it
//         });
//
//     await agent.post(HOST + '/users').send(user002)
//         .then((res, err) => {
//             expect(err).toBe(undefined);
//             expect(res.statusCode).toBe(201);
//             done();
//         }).catch(e => {
//             // deal with it
//         });
//
//     return await agent.get(HOST + '/search/username').query({q: "001"})
//         .then((err, res) => {
//             expect(err).toBe(null);
//             let users = res.body;
//             expect(users).toContain(user001);
//             done();
//         }).catch(e => {
//
//         });
//
// });

// test("Can search public messages", async () => {
//     await agent.post(HOST + '/users').send(user001)
//         .then((res, err) => {
//             expect(err).toBe(undefined);
//             expect(res.statusCode).toBe(201);
//         }).catch(e => {
//             // deal with it
//         });
//
//     await agent.post(HOST + '/users').send(user002)
//         .then((res, err) => {
//             expect(err).toBe(undefined);
//             expect(res.statusCode).toBe(201);
//         }).catch(e => {
//             // deal with it
//         });
//
//     return await agent.get(HOST + '/search/username').query({q: "001"})
//         .then((err, res) => {
//             expect(err).toBe(null);
//             let users = res.body;
//             expect(users).toContain(user001);
//         }).catch(e => {
//
//         });
//
// });
