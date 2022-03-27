const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  content: { type: String, default: "", trim: true }, // trim: true will remove all leading and trailing spaces
  author: { type: String, trim: true }, // trim: true will remove all leading and trailing spaces
  target: { type: String, trim: true },
  postedAt: { type: String },
  deliveryStatus: { type: String },
  chatID: { type: String },
  unread: { type: Boolean, default: true },
  type: { type: String },
});

const Message = mongoose.model("Message", messageSchema);
const MessageTest = mongoose.model("MessageTest", messageSchema);

exports.Message = Message;
exports.MessageTest = MessageTest;
