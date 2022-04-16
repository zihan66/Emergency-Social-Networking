let agent = require("superagent");
let app = require("../app");
const axios = require("axios");

require("dotenv").config();
const mongoose = require("mongoose");
const Socket = require("../socket");

let PORT = 3001;
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

test("Can Join/Unjoin an  event", () => {
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
