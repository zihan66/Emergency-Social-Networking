const mongoose = require("mongoose");

// establish database connection
const messageSchema = new mongoose.Schema({
  message: { type: String, default: "", trim: true },
  username: { type: String, default: "", trim: true },
  time: { type: String, default: "", trim: true },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
