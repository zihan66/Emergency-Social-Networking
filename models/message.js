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

messageSchema.index({ content: "text" });

messageSchema.statics.searchPublicMessage = async function (
  searchContent,
  limit
) {
  const result = await this.find({
    type: "public",
    $text: { $search: searchContent },
  })
    .sort({ postedAt: -1 })
    .limit(limit);
  return result;
};

messageSchema.statics.searchPrivateMessage = async function (
  searchContent,
  limit,
  chatId
) {
  const result = await this.find({
    chatId,
    $text: { $search: searchContent },
  })
    .sort({ postedAt: -1 })
    .limit(limit);
  return result;
};

const Message = mongoose.model("Message", messageSchema);
const MessageTest = mongoose.model("MessageTest", messageSchema);

exports.Message = Message;
exports.MessageTest = MessageTest;
