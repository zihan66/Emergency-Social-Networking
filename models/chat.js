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

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
