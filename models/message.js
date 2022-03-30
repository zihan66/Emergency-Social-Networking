const mongoose = require("mongoose");
const { convertListOfStringToListOfRegex } = require("../lib/utils");

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

messageSchema.statics.searchPublicMessage = async function (
  searchContent,
  limit
) {
  const result = await this.find({
    type: "public",
    content: { $in: convertListOfStringToListOfRegex(searchContent) },
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
    content: { $in: convertListOfStringToListOfRegex(searchContent) },
  })
    .sort({ postedAt: -1 })
    .limit(limit);
  return result;
};

messageSchema.statics.searchAnnouncement = async function (
  searchContent,
  limit
) {
  const result = await this.find({
    type: "announcement",
    content: { $in: convertListOfStringToListOfRegex(searchContent) },
  })
    .sort({ postedAt: -1 })
    .limit(limit);
  return result;
};

const Message = mongoose.model("Message", messageSchema);
const MessageTest = mongoose.model("MessageTest", messageSchema);

exports.Message = Message;
exports.MessageTest = MessageTest;
