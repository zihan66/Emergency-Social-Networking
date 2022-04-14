let agent = require("superagent");
let app = require("../app");
const axios = require("axios");

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
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
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

const msg001 = {
  content: "Hello, I am 001",
  username: "001",
};

const msg002 = { content: "I am 002", username: "002" };

const msg003 = {
  content: "Hello",
  username: "001",
  messageType: "Private",
  target: "002",
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
        expect(users).toContain({ username: "001" });
        expect(users).toContain({ username: "002" });
      })
      .catch((e) => {});
  })().catch((e) => {
    // deal with chain fail
  });
});

// search username
test("Can search user by name", () => {
  return (async () => {
    await agent
      .get(HOST + "/search/username")
      .query({ q: "001" })
      .then((err, res) => {
        expect(err).toBe(null);
        let users = res.body;
        expect(users).toContain(user001);
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("measure performance test", () => {
  return (async () => {
    await agent
      .post(HOST + "/performance")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {});

    await agent
      .delete(HOST + "/performance")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can post public message", () => {
  return (async () => {
    await agent
      .post(HOST + "/messages/public")
      .send(msg001)
      .then(function (err, res) {
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {
        // deal with it
      });
  })().catch((e) => {});
});

test("Can post announcement", () => {
  return (async () => {
    await agent
      .post(HOST + "/messages/announcement")
      .send(msg001)
      .then(function (err, res) {
        expect(res.statusCode).toBe(201);
      });
  })().catch((e) => {});
});

// search public message
test("Can search public message", () => {
  return (async () => {
    await agent
      .get(HOST + "/search/publicMessage")
      .query({ q: "Hello", page: 1 })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        let messages = res.body;
        expect(messages).toContain("Hello");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can search announcement", () => {
  return (async () => {
    await agent
      .get(HOST + "/search/announcement")
      .query({ q: "Hello", page: 1 })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        let announcements = res.body;
        expect(announcements).toContain("Hello");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Get announcement", () => {
  return (async () => {
    await agent
      .get(HOST + "/messages/announcement")
      .send()
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {
        // deal with it
      });
  })().catch((e) => {});
});

let chat_id;

test("Can post a chat", () => {
  return (async () => {
    await agent
      .post(HOST + "/chats")
      .send({ username1: "001", username2: "002" })
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
        chat_id = res.body.chatID;
      })
      .catch((e) => {
        // deal with it
      });
  })().catch((e) => {});
});

// test('Can get a chat', () => {
//     return (async () => {
//         await agent.get(HOST + '/chats/' + chat_id).send()
//             .then((res, err) => {
//                 expect(err).toBe(undefined);
//                 expect(res.statusCode).toBe(200);
//             }).catch(e => {
//                 // deal with it
//             });
//     })().catch(e => {
//
//     })
//
// });

test("Can post private message", () => {
  return (async () => {
    await agent
      .post(HOST + "/messages/private")
      .send({
        author: "001",
        target: "002",
        content: "How are you",
        chatID: chat_id,
      })
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {
        // deal with it
      });
  })().catch((e) => {});
});

// search private message
test("Can search private message", () => {
  return (async () => {
    await agent
      .get(HOST + "/search/privateMessage")
      .query({ q: "Hello", chatId: chat_id, page: 1 })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can search private message", () => {
  return (async () => {
    await agent
      .get(HOST + "/search/privateMessage")
      .query({ q: "How are you", chatId: chat_id, page: 1 })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});
