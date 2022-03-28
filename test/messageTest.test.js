const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Message = require("../models/message").Message;
const moment = require("moment");

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

test("It should be possible to delete a new message", async () => {
  const message1 = new Message({
    content: "123",
    author: "Hakan",
    target: "Tony",
    postedAt: moment().format(),
    deliveryStatus: "OK",
    chatID: "999",
    unread: true,
  });
  await message1.save();
  await message1.remove();
  const messageFound = await Message.findOne({ author: "Hakan" });
  expect(messageFound).toBe(null);
}, 30000);

test("It should be possible to save a new message", async () => {
  const message1 = new Message({
    content: "123",
    author: "Hakan",
    target: "Tony",
    postedAt: moment().format(),
    deliveryStatus: "OK",
    chatID: "345",
    unread: true,
  });
  await message1.save();
  const messageFound = await Message.findOne({ author: "Hakan" });
  expect(messageFound.content).toBe(message1.content);
  expect(messageFound.author).toBe(message1.author);
  expect(messageFound.target).toBe(message1.target);
  expect(messageFound.postedAt).toBe(message1.postedAt);
  expect(messageFound.deliveryStatus).toBe(message1.deliveryStatus);
  expect(messageFound.chatID).toBe(message1.chatID);
  expect(messageFound.unread).toBe(message1.unread);
});

test("It should be possible to update a new message", async () => {
  const message1 = new Message({
    content: "123",
    author: "Tom",
    target: "Tony",
    postedAt: moment().format(),
    deliveryStatus: "OK",
    chatID: "666",
    unread: true,
  });
  await message1.save();
  await Message.updateOne({ chatID: "666" }, { unread: false });
  const messageFound = await Message.findOne({ chatID: "666" });
  expect(messageFound.content).toBe(message1.content);
  expect(messageFound.author).toBe(message1.author);
  expect(messageFound.target).toBe(message1.target);
  expect(messageFound.postedAt).toBe(message1.postedAt);
  expect(messageFound.deliveryStatus).toBe(message1.deliveryStatus);
  expect(messageFound.chatID).toBe(message1.chatID);
  expect(messageFound.unread).toBe(false);
});

test("messagesAreIndependent", async () => {
  const message1 = new Message({
    content: "123",
    author: "Tommy",
    target: "Tommy1",
    postedAt: moment().format(),
    deliveryStatus: "OK",
    chatID: "321",
    unread: true,
  });
  await message1.save();
  const message2 = new Message({
    content: "321",
    author: "Tommy2",
    target: "Tommy3",
    postedAt: moment().format(),
    deliveryStatus: "OK",
    chatID: "123",
    unread: true,
  });
  await message2.save();
  const messageFound1 = await Message.findOne({ chatID: "321" });
  const messageFound2 = await Message.findOne({ chatID: "123" });
  expect(messageFound1.content).not.toBe(messageFound2.content);
  expect(messageFound1.author).not.toBe(messageFound2.author);
  expect(messageFound1.target).not.toBe(messageFound2.target);
  // expect(messageFound1.postedAt).not.toBe(messageFound2.postedAt);
  // expect(messageFound.deliveryStatus).not.toBe(message1.deliveryStatus);
  expect(messageFound1.chatID).not.toBe(messageFound2.chatID);
  // expect(messageFound.unread).not.toBe(message1.unread);
});
