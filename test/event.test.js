const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Event = require("../models/event");
let mongoServer;
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

test("It should be possible to save a new event", async () => {
  const currentEvent = {
    title: "test",
    startTime: "April 29, 2022 11:40 AM",
    location: "1900 JONes Butler RD, Boston, MA 02139",
    host: "zihan",
    type: "other",
    details: "etc",
    participants: ["zihan"],
  };
  await Event.create(currentEvent);
  const response = await Event.findOne({ title: "test" });
  expect(response.host).toBe(currentEvent.host);
});

test("It should be possible to join a event", async () => {
  const response = await Event.findOne({ title: "test" });
  const eventId = response.id;
  await Event.joinEvent(eventId, "another");
  const data = await Event.findOne({ _id: eventId });
  expect(data.participants).toContain("another");
});

test("It should be possible to unjoin a event", async () => {
  const response = await Event.findOne({ title: "test" });
  const eventId = response.id;
  await Event.leaveEvent(eventId, "another");
  const data = await Event.findOne({ _id: eventId });
  expect(data.participants).not.toContain("another");
});

test("It should be possible to find all unexpiredEvents", async () => {
  const currentEvent = {
    title: "test",
    startTime: "April 29, 2012 11:40 AM",
    location: "1900 JONes Butler RD, Boston, MA 02139",
    host: "zihan",
    type: "other",
    details: "etc",
    participants: ["zihan"],
  };
  await Event.create(currentEvent);
  const response = await Event.findAllUnexpiredEvent();
  expect(response.length).toBe(1);
});

test("It should be possible to delete an event", async () => {
  const currentEvent = {
    title: "test2",
    startTime: "April 29, 2012 11:40 AM",
    location: "1900 JONes Butler RD, Boston, MA 02139",
    host: "zihan",
    type: "other",
    details: "etc",
    participants: ["zihan"],
  };
  await Event.create(currentEvent);
  await Event.deleteOne({ title: "test2" });
  const event = await Event.findOne({ title: "test2" });
  expect(event).toBeNull();
});
