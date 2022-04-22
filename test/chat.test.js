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
  const chat = await Chat.findOne({ username1: "Hakan" });
  expect(chat.username2).toBe(hakanChat.username2);
});

test("twoChatIDConflictCheck", async () => {
  const hakanChat = new Chat({
    username1: "Hakan",
    username2: "Hakan2",
    chatID: new Date().getTime().toString(36),
  });
  await hakanChat.save();
  const hakanChat2 = new Chat({
    username1: "Hakan3",
    username2: "Hakan4",
    chatID: new Date().getTime().toString(36),
  });
  await hakanChat2.save();
  const chat = await Chat.findOne({ username1: "Hakan" });
  const chat2 = await Chat.findOne({ username1: "Hakan3" });
  expect(chat.chatID).not.toBe(chat2.chatID);
});

test("findChatsOfUserCheck", async () => {
  const hakanChat = new Chat({
    username1: "Hakan",
    username2: "Hakan2",
    chatID: new Date().getTime().toString(36),
  });
  await hakanChat.save();
  const chat = await Chat.findChatsOfUser("Hakan");
  const chat2 = await Chat.findChatsOfUser("Hakan2");
  // const chat = await Chat.findOne({ username1: "Hakan" });
  // const chat2 = await Chat.findOne({ username2: "Hakan2" });
  expect(chat.chatID).toBe(chat2.chatID);
});

test("findChatBetweenTwoUsersReturnCheck", async () => {
  const hakanChat = new Chat({
    username1: "Hakan",
    username2: "Hakan2",
    chatID: new Date().getTime().toString(36),
  });
  await hakanChat.save();
  const hakanChat2 = new Chat({
    username1: "Hakan3",
    username2: "Hakan4",
    chatID: new Date().getTime().toString(36),
  });
  await hakanChat2.save();
  const chat = await Chat.findChatBetweenTwoUsers("Hakan", "Hakan2");
  const chat2 = await Chat.findChatBetweenTwoUsers("Hakan2", "Hakan");
  expect(chat.chatID).toBe(chat2.chatID);
});

//findChatsOfUser
test("findChatsOfUserReturnCheck", async () => {
  const chatID = new Date().getTime().toString(36);
  const hakanChat = new Chat({
    username1: "Hakan",
    username2: "Hakan2",
    chatID: new Date().getTime().toString(36),
  });
  await hakanChat.save();
  const hakanChat2 = new Chat({
    username1: "Hakan3",
    username2: "Hakan4",
    chatID,
  });
  await hakanChat2.save();
  const chat = await Chat.findChatsOfUser("Hakan");
  const anotherUser = await Chat.findAnotherUser("Hakan4", chatID);
  const anotherUser2 = await Chat.findAnotherUser("Hakan2", chatID);
  expect(anotherUser).toBe("Hakan2");
  expect(anotherUser2).toBe("Hakan");
  const chat2 = await Chat.findChatsOfUser("Hakan2");
  expect(chat.chatID).toBe(chat2.chatID);
});
