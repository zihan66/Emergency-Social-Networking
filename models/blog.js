const mongoose = require("mongoose");
const { convertListOfStringToListOfRegex } = require("../lib/utils");

const blogSchema = new mongoose.Schema({
  content: { type: String, default: "", trim: true }, // trim: true will remove all leading and trailing spaces
  author: { type: String, trim: true }, // trim: true will remove all leading and trailing spaces
  // target: { type: String, trim: true },
  postedAt: { type: String },
  deliveryStatus: { type: String },
  // chatID: { type: String },
  // unread: { type: Boolean, default: true },
  type: { type: String },
  picture: {type: String, default: "default_pic", trim: true},
  text: {type: String, default: ""},
  prevContentLink:{type: String, default: "null", trim: true},
  nextContentLink:{type: String, default: "null", trim: true},
  likeCount:{type: Number, default: "0"},
  dislikeCount:{type: Number, default: "0"},
  // blogID: {type: String}, //use _id instead
});

blogSchema.statics.searchBlog = async function (
  searchContent,
  limit
) {
  const result = await this.find({
    type: "blog",
    content: { $in: convertListOfStringToListOfRegex(searchContent) },
  })
    .sort({ postedAt: -1 })
    .limit(limit);
  return result;
};

// blogSchema.statics.searchPrivateBlog = async function (
//   searchContent,
//   limit,
//   chatId
// ) {
//   const result = await this.find({
//     chatID: chatId,
//     content: { $in: convertListOfStringToListOfRegex(searchContent) },
//   })
//     .sort({ postedAt: -1 })
//     .limit(limit);
//   return result;
// };

// blogSchema.statics.searchAnnouncement = async function (
//   searchContent,
//   limit
// ) {
//   const result = await this.find({
//     type: "announcement",
//     content: { $in: convertListOfStringToListOfRegex(searchContent) },
//   })
//     .sort({ postedAt: -1 })
//     .limit(limit);
//   return result;
// }; 

const Blog = mongoose.model("Blog", blogSchema);
const BlogTest = mongoose.model("BlogTest", blogSchema);

exports.Blog = Blog;
exports.BlogTest = BlogTest;
