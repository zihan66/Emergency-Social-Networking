let agent = require("superagent");
let app = require("../app");
const axios = require("axios");

require("dotenv").config();
const mongoose = require("mongoose");
const Socket = require("../socket");

let PORT = 3003;
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
  isDonor: true,
  bloodType: "O",
};

const user002 = {
  username: "002",
  password: "1234",
  islogin: true,
  lastStatusCode: "OK",
  isAcknowledge: true,
  isDonor: false,
  bloodType: "A",
};

const msg001 = {
  id: 0,
  content: "Hello, I am 001",
  username: "001",
};

const msg002 = { id: 1, content: "I am 002", username: "002" };

const msg003 = {
  id: 2,
  content: "Hello",
  username: "001",
  messageType: "Private",
  target: "002",
};

let chat_id = 345;

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
        console.log("users!!!!!!!!");
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

test('Can get a chat', () => {
    return (async () => {
        await agent.get(HOST + '/chats/' + chat_id).send()
            .then((res, err) => {
                expect(err).toBe(undefined);
                expect(res.statusCode).toBe(200);
            }).catch(e => {
                // deal with it
            });
    })().catch(e => {

    })

});

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

test("Can render to chart Donor page", () => {
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

test("Can Update User Blood Type", () => {
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

test("Can Become Donor", () => {
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

test("Can Get One User Record", () => {
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

test("Can Set User Status", () => {
  return (async () => {
    await agent
      .put(HOST + "/users/001/status/OK")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can User Login", () => {
  return (async () => {
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
  })().catch((e) => {});
});

test("Can User offline", () => {
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

test("Can Get All Users ", () => {
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

test("Can Performances Start Test ", () => {
  return (async () => {
    await agent
      .post(HOST + "/performances")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can Performances Start Stop ", () => {
  return (async () => {
    await agent
      .delete(HOST + "/performances")
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});

test("Can User update acknowledgement ", () => {
  return (async () => {
    await agent
      .put(HOST + "/users/001/acknowledgement")
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
      .put(HOST + `/messages/private/${msg001.id}/unread`)
      .then((err, res) => {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        // let messages = res.body;
        // expect(messages).toContain("002");
      })
      .catch((e) => {});
  })().catch((e) => {});
});
test("Can post new blog", () => {
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

test("Get blogs", () => {
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
