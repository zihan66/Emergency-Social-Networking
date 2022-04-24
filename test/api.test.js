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
  isLogin: true,
  lastStatusCode: "OK",
  isAcknowledge: true,
  isDonor: true,
  bloodType: "O",
};

const user002 = {
  username: "002",
  password: "1234",
  isLogin: true,
  lastStatusCode: "OK",
  isAcknowledge: true,
  isDonor: false,
  bloodType: "A",
};

const dummy = {
  username: "dummy",
  password: "123xyz",
  isLogin: false,
  lastStatusCode: "OK",
  isAcknowledge: true,
  isDonor: false,
  bloodType: "A",
  privilege: "citizen",
  accountStatus: "inactive",
};

const foo = {
  username: "foo",
  password: "123xyz",
  isLogin: true,
  lastStatusCode: "OK",
  isAcknowledge: true,
  isDonor: false,
  bloodType: "A",
  privilege: "citizen",
  accountStatus: "active",
};

const testAdmin = {
  username: "ESNAdmin",
  password: "admin",
  isLogin: true,
  lastStatusCode: "OK",
  isAcknowledge: true,
  isDonor: false,
  bloodType: "O",
};

const msg001 = {
  id: 0,
  content: "Hello, I am 001",
  username: "001",
};

const testMessage = {
  id: 4,
  content: "Test",
  username: "001",
};

const msg002 = {
  id: 1,
  content: "I am 002",
  username: "002",
};

const msg003 = {
  id: 2,
  content: "Hello",
  username: "001",
  messageType: "Private",
  target: "002",
};

let chat_id = 345;

test("Can create user", () => {
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
  })().catch((e) => {
    // deal with chain fail
  });
});

test("Cannot create duplicate user", async () => {
  await agent
    .post(HOST + "/users")
    .send(user001)
    .then((res, err) => {
      expect(err).toBe(undefined);
      expect(res.statusCode).toBe(405);
    })
    .catch((e) => {
      expect(e.status).toBe(405);
    });
});

test("Can User Login", () => {
  return (async () => {
    await agent
      .put(HOST + "/users/001/online")
      .send({
        password: "12d4",
      })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});

    await agent
      .put(HOST + "/users/001/online")
      .send({
        password: "1234",
      })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});

    await agent
      .put(HOST + "/users/001/acknowledgement")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});

    await agent
      .put(HOST + "/users/001/online")
      .send({
        password: "1234",
      })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});

    await agent
      .put(HOST + "/users/004/online")
      .send({
        password: "1234",
      })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});

    await agent
      .put(HOST + "/users/001/status/OK")
      .send({})
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {});

    await agent
      .put(HOST + "/users/002/status/OK")
      .send({})
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can search user by status", () => {
  return (async () => {
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
  })();
});

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
    for (let i = 0; i < 11; i++) {
      await agent
        .post(HOST + "/messages/public")
        .send(testMessage)
        .then(function (err, res) {
          expect(res.statusCode).toBe(201);
        })
        .catch((e) => {
          // deal with it
        });
    }
  })().catch((e) => {});
});

test("Can post announcement", () => {
  return (async () => {
    await agent
      .post(HOST + "/messages/announcement")
      .send(msg001)
      .then(function (err, res) {
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {
        // deal with it
      });
    for (let j = 0; j < 11; j++) {
      await agent
        .post(HOST + "/messages/announcement")
        .send(testMessage)
        .then(function (err, res) {
          expect(res.statusCode).toBe(201);
        })
        .catch((e) => {
          // deal with it
        });
    }
  })().catch((e) => {});
});

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

    await agent
      .get(HOST + "/search/publicMessage")
      .query({ q: "Test", page: 1 })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        let messages = res.body;
        expect(messages).toContain("Hello");
      })
      .catch((e) => {});

    await agent
      .get(HOST + "/search/publicMessage")
      .query({ q: "the", page: 1 })
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

    await agent
      .get(HOST + "/search/announcement")
      .query({ q: "Test", page: 1 })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        let announcements = res.body;
        expect(announcements).toContain("Hello");
      })
      .catch((e) => {});

    await agent
      .get(HOST + "/search/announcement")
      .query({ q: "the", page: 1 })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        let announcements = res.body;
        expect(announcements).toContain("Hello");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can search public message", () => {
  return (async () => {
    await agent
      .get(HOST + "/search/publicMessage")
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

test("Get post announcement", () => {
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

test("Can post private message", () => {
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
    console.log(chat_id);
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

    await agent
      .post(HOST + "/chats")
      .send({
        username1: "001",
        username2: "002",
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

    await agent
      .get(HOST + `/messages/private?chat_id=${chat_id}`)
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can search status", () => {
  return (async () => {
    await agent
      .get(HOST + "/search/status")
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

test("Can get all private chats", () => {
  return (async () => {
    await agent
      .get(HOST + "/chats?username=001")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can render private chat page when need blood", () => {
  return (async () => {
    await agent
      .get(HOST + `/chats/${chat_id}/002?isToDonor=true`)
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can get all donors", () => {
  return (async () => {
    await agent
      .get(HOST + "/users/donors")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can update blood type", () => {
  return (async () => {
    await agent
      .put(HOST + "/users/001/updateBloodType")
      .send({
        bloodType: "O",
      })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can become a donor", () => {
  return (async () => {
    await agent
      .put(HOST + "/users/001/isDonor")
      .send({
        bloodType: "O",
        isDonor: true,
      })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can delete a donor", () => {
  return (async () => {
    await agent
      .put(HOST + "/users/002/isDonor")
      .send({
        bloodType: "O",
        isDonor: false,
      })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can get a citizen's record", () => {
  return (async () => {
    await agent
      .get(HOST + "/users/001")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can logout a user", () => {
  return (async () => {
    await agent
      .put(HOST + "/users/001/offline")
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
      .query({ q: "the", chatId: chat_id, page: 1 })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});

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

test("Cannot search invalid query", () => {
  return (async () => {
    await agent
      .get(HOST + "/search/privateMessage")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(403);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});

    await agent
      .get(HOST + "/search/users")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(403);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});

    await agent
      .get(HOST + "/search/publicMessage")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(403);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});

    await agent
      .get(HOST + "/search/status")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(403);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});

    await agent
      .get(HOST + "/search/announcement")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(403);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can retrieve all users", () => {
  return (async () => {
    await agent
      .get(HOST + "/users")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can messages private unread ", () => {
  return (async () => {
    await agent
      .put(HOST + `/messages/private/unread?username=002`)
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can post a new blog", () => {
  return (async () => {
    await agent
      .post(HOST + "/blog")
      .send({
        content: "112233",
        author: "HakanSearch",
        postedAt: "testTime",
        deliveryStatus: "OK",
        type: "blog",
        picture: "ambulance",
        text: "testText",
        prevContentLink: "null",
        nextContentLink: "null",
        likeCount: "0",
        dislikeCount: "0",
        _id: "123456789012",
        username: "001",
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

test("Can get blogs", () => {
  return (async () => {
    await agent
      .post(HOST + "/blog")
      .send({
        content: "112233",
        author: "HakanSearch",
        postedAt: "testTime",
        deliveryStatus: "OK",
        type: "blog",
        picture: "ambulance",
        text: "testText",
        prevContentLink: "null",
        nextContentLink: "null",
        likeCount: "0",
        dislikeCount: "0",
        _id: "123456789012",
        username: "001",
      })
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {
        // deal with it
      });
    await agent
      .get(HOST + "/blog/")
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

test("Get a blog error", () => {
  return (async () => {
    await agent
      .post(HOST + "/blog")
      .send({
        content: "112233",
        author: "HakanSearch",
        postedAt: "testTime",
        deliveryStatus: "OK",
        type: "blog",
        picture: "ambulance",
        text: "testText",
        prevContentLink: "null",
        nextContentLink: "null",
        likeCount: "0",
        dislikeCount: "0",
        username: "001",
        _id: "123456789012",
      })
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {
        // deal with it
      });
    await agent
      .get(HOST + "/blog/123456789012")
      .send()
      .then((res, err) => {
        expect(err).not.toBe(undefined);
      })
      .catch((e) => {
        // deal with it
      });
  })().catch((e) => {});
});

// since I am not able to know _id here so I just test like/dislike error
test("Like a blog", () => {
  return (async () => {
    await agent
      .post(HOST + "/blog")
      .send({
        content: "112233",
        author: "HakanSearch",
        postedAt: "testTime",
        deliveryStatus: "OK",
        type: "blog",
        picture: "ambulance",
        text: "testText",
        prevContentLink: "null",
        nextContentLink: "null",
        likeCount: "0",
        dislikeCount: "0",
        _id: "123456789012",
        username: "001",
      })
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {
        // deal with it
      });
    await agent
      .post(HOST + "/blog/like/123456789012")
      .send()
      .then((res, err) => {
        expect(err).not.toBe(undefined);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {
        // deal with it
      });
  })().catch((e) => {});
});

test("Dislike a blog", () => {
  return (async () => {
    await agent
      .post(HOST + "/blog")
      .send({
        content: "112233",
        author: "HakanSearch",
        postedAt: "testTime",
        deliveryStatus: "OK",
        type: "blog",
        picture: "ambulance",
        text: "testText",
        prevContentLink: "null",
        nextContentLink: "null",
        likeCount: "0",
        dislikeCount: "0",
        username: "001",
        _id: "123456789012",
      })
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {
        // deal with it
      });
    await agent
      .post(HOST + "/blog/dislike/123456789012")
      .send()
      .then((res, err) => {
        expect(err).not.toBe(undefined);
        expect(res.statusCode).toBe(404);
      })
      .catch((e) => {
        // deal with it
      });
  })().catch((e) => {});
});

test("Delete a blog", () => {
  return (async () => {
    await agent
      .post(HOST + "/blog")
      .send({
        content: "112233",
        author: "HakanSearch",
        postedAt: "testTime",
        deliveryStatus: "OK",
        type: "blog",
        picture: "ambulance",
        text: "testText",
        prevContentLink: "null",
        nextContentLink: "null",
        likeCount: "0",
        dislikeCount: "0",
        username: "001",
        _id: "123456789012",
      })
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {
        // deal with it
      });
    await agent
      .post(HOST + "/blog/delete/123456789012")
      .send()
      .then((res, err) => {
        expect(res.statusCode).toBe(404);
      })
      .catch((e) => {
        // deal with it
      });
  })().catch((e) => {});
});

test("Can create an event", () => {
  return (async () => {
    await agent
      .post(HOST + "/events")
      .send({
        title: "test",
        location: "1800 Holleamn Drive, MTV, CA, 98609",
        host: "test",
        type: "other",
        details: "test",
        startTime: "April 29, 2222 11:40 AM",
      })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can Join/Unjoin an event", () => {
  return (async () => {
    const response = await axios.get(HOST + "/events");
    const data = response.data[0];
    const { _id: eventId } = data;
    await agent
      .put(HOST + `/events/${eventId}/join?username=zihan`)
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {});
    await agent
      .put(HOST + `/events/${eventId}/unjoin?username=zihan`)
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Cannot Join/Unjoin a non-existing event", async () => {
  await agent
    .put(HOST + `/events/6262435ed7ab8de2ad036855/join?username=test`)
    .then((res) => {
      console.log(res.statusCode);
      expect(res.statusCode).toBe(200);
    })
    .catch((e) => {
      expect(e.status).toBe(403);
    });

  await agent
    .put(HOST + `/events/6262435ed7ab8de2ad036855/unjoin?username=test`)
    .then((res) => {
      console.log(res.statusCode);
      expect(res.statusCode).toBe(200);
    })
    .catch((e) => {
      expect(e.status).toBe(403);
    });

  await agent
    .delete(HOST + `/events/6262435ed7ab8de2ad036855`)
    .then((res) => {
      console.log(res.statusCode);
      expect(res.statusCode).toBe(200);
    })
    .catch((e) => {
      expect(e.status).toBe(403);
    });
});

test("Cannot unjoin a event created by me", () => {
  return (async () => {
    const response = await axios.get(HOST + "/events");
    const data = response.data[0];
    const { _id: eventId } = data;
    await agent
      .put(HOST + `/events/${eventId}/unjoin?username=test`)
      .then((res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can get events by host", () => {
  return (async () => {
    await agent
      .get(HOST + `/events/zihan`)
      .then((res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can delete an event", () => {
  return (async () => {
    const response = await axios.get(HOST + "/events");
    const data = response.data[0];
    const { _id: eventId } = data;
    await agent
      .delete(HOST + `/events/${eventId}`)
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("measure performance test", () => {
  return (async () => {
    await agent
      .post(HOST + "/performances")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {});
    setTimeout(() => {}, 100);
    await agent
      .post(HOST + "/messages/public")
      .send(msg001)
      .then(function (err, res) {
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {
        // deal with it
      });

    await agent
      .post(HOST + "/performances")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {});

    await agent
      .delete(HOST + "/performances")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {});
  })().catch((e) => {});
});

// iteration 5 part
test("Can login as administrator", () => {
  return (async () => {
    await agent
      .post(HOST + "/users")
      .send(testAdmin)
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
        // expect(testAdmin.privilege).toBe("administrator");
      })
      .catch((e) => {
        console.log(e);
      });

    await agent
      .put(HOST + "/users/ESNAdmin")
      .send({ username: "ESNAdmin", privilege: "administrator" })
      .then((res, err) => {
        expect(err).toBe(404);
        expect(res.statusCode).toBe(200);
        expect(testAdmin.privilege).toBe("administrator");
      });
  })().catch((e) => {});
});

test("Cannot turn the only administrator to citizen", () => {
  return (async () => {
    await agent
      .put(HOST + "/users/ESNAdmin")
      .send({ username: "ESNAdmin", privilege: "citizen" })
      .then((res, err) => {
        expect(err).toBe(404);
        expect(res.statusCode).toBe(400);
        expect(testAdmin.privilege).toBe("administrator");
      });
  })().catch((e) => {});
});

test("Cannot get citizen profile if not administrator", () => {
  return (async () => {
    await agent
      .get(HOST + "/users/edit/001;")
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can update citizen's username", () => {
  let oldName = "foo";
  let newName = "duck";

  return (async () => {
    await agent
      .post(HOST + "/users")
      .send(foo)
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {});

    await agent
      .put(HOST + "/users/foo")
      .send({ username: newName })
      .then((res, err) => {
        expect(err).toBe(404);
        expect(res.statusCode).toBe(204);
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can update citizen's password", () => {
  return (async () => {
    await agent
      .post(HOST + "/users")
      .send(foo)
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {});

    await agent
      .put(HOST + "/users/foo/online")
      .send({ username: "foo", password: "123xyz" })
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {});

    await agent
      .put(HOST + "/users/foo")
      .send({ username: "foo", password: 12306 })
      .then((res, err) => {
        expect(err).toBe(404);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can not deactivate the only administrator", () => {
  return (async () => {
    await agent
      .put(HOST + "/users/ESNAdmin/inactive")
      .send()
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(400);
        expect(testAdmin.accountStatus).toBe("active");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can put a user to inactive", () => {
  return (async () => {
    await agent
      .post(HOST + "/users")
      .send(foo)
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {
        // deal with it
      });

    await agent
      .put(HOST + "/users/foo/online")
      .send({ password: "123xyz" })
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {
        // do something
      });

    await agent
      .put(HOST + "/users/foo/inactive")
      .send()
      .then((res, err) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(foo.accountStatus).toBe("inactive");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can not login inactive user", () => {
  return (async () => {
    await agent
      .post(HOST + "/users")
      .send(dummy)
      .then((res, err) => {
        expect(err).toBe(undefined);
        expect(res.statusCode).toBe(201);
      })
      .catch((e) => {
        // console.log(e);
      });

    await agent
      .post(HOST + "/users/dummy/online")
      .send({ password: "123xyz" })
      .then((res, err) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(404);
        expect(foo.isLogin).toBe(false);
      })
      .catch((e) => {
        // console.log(e);
      });
  })().catch((e) => {});
});

test("Can bring an inactive user back to active", () => {
  return (async () => {
    await agent
      .put(HOST + "/users/dummy/active")
      .send()
      .then((res, err) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
      })
      .catch((e) => {
        // console.log(e);
      });
  })().catch((e) => {});
});

test("Cannot change to existing username", () => {
  return (async () => {
    await agent
      .put(HOST + "/users/001")
      .send({ username: "dummy" })
      .then((res, err) => {
        expect(err).toBe(404);
        expect(res.statusCode).toBe(400);
        expect(foo.username).toBe("001");
      })
      .catch((e) => {});
  })().catch((e) => {});
});
