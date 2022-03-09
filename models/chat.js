const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatID: { type: String },
  username1: { type: String },
  username2: { type: String },
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
