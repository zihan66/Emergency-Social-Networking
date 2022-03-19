const mongoose = require("mongoose");
// establish database connection
const messageSchema = new mongoose.Schema({
  content: { type: String, default: "", trim: true }, // trim: true will remove all leading and trailing spaces
  author: { type: String, trim: true }, // trim: true will remove all leading and trailing spaces
  target: { type: String, trim: true },
  postedAt: { type: String },
  deliveryStatus: { type: String },
  chatID: { type: String },
  unread: { type: Boolean, default: true },
});

// current user
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
