const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Chat = require("../models/chat");
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

test("It should be possible to save a new chat", async () => {
  const hakanChat = new Chat({
    username1: "Hakan",
    username2: "Hakan2",
    chatID: new Date().getTime().toString(36),
  });
  const response = await hakanChat.save();
  const chat = await Chat.findOne({ username1: "Hadßan" });
  expect(chat.username2).toBe(hakanChat.username2);
});
