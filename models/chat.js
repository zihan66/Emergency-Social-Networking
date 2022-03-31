const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatID: { type: String },
  username1: { type: String },
  username2: { type: String },
});

chatSchema.statics.findChatsOfUser = async function (username) {
  return this.find({ $or: [{ username1: username }, { username2: username }] });
};

chatSchema.statics.findChatBetweenTwoUsers = async function (
  username1,
  username2
) {
  return this.findOne({
    $or: [
      { username1, username2 },
      { username1: username2, username2: username1 },
    ],
  });
};

chatSchema.statics.createANewPrivateChat = async function (username1,username2) {
  console.log("createANewPrivateChat1");
  if (username1 === undefined || username2 === undefined) {
    console.log("undefined");
    res.status(404).json({});
    return;
  }
  const existedChat = await Chat.findChatBetweenTwoUsers(
    username1,
    username2
  );
  console.log(existedChat);
  if (existedChat) {
    console.log("existed");
    res.status(404).json({});
    return;
  }
  const currentChat = {
    chatID: new Date().getTime().toString(36),
    username1,
    username2,
  };
  console.log("createANewPrivateChat2");
  const response = await Chat.create(currentChat);
  console.log("createANewPrivateChat3");
  return response;
};
// createNewPrivateChat

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
