const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// establish database connection
const userSchema = new mongoose.Schema({
  username: { type: String, default: "", trim: true }, // trim: true will remove all leading and trailing spaces
  password: {
    type: String,
    set(val) {
      return bcrypt.hashSync(val, 6);
    },
    trim: true,
  }, // trim: true will remove all leading and trailing spaces
  isLogin: {
    type: Boolean,
    default: false,
  },
  isAcknowledge: { type: Boolean, default: false },
  lastStatusCode: { type: String, default: "unknown" },
  // lastStatusUpdateTime: {type: String, default: "unknownTime"},
});

userSchema.index({ username: "text" });

userSchema.statics.findAllUsers = async function () {
  const onlineUsers = await this.find({ isLogin: true }).sort({
    username: 1,
  });
  const offlineUsers = await this.find({ isLogin: false }).sort({
    username: 1,
  });
  const wholeUserList = onlineUsers.concat(offlineUsers);
  const filteredUserList = wholeUserList.map((user) => {
    const { username, isLogin, lastStatusCode } = user;
    return { username, isLogin, lastStatusCode };
  });
  return filteredUserList;
};

userSchema.statics.searchUsersByUsername = async function (searchContent) {
  const onlineUsers = await this.find({
    isLogin: true,
    $text: { $search: searchContent },
  });

  const offlineUsers = await this.find({
    isLogin: false,
    $text: { $search: searchContent },
  });

  const wholeUserList = onlineUsers.concat(offlineUsers);
  const filteredUserList = wholeUserList.map((user) => {
    const { username, isLogin, lastStatusCode } = user;
    return { username, isLogin, lastStatusCode };
  });

  return filteredUserList;
};

userSchema.statics.findUserByStatus = async function (status) {
  const onlineUsers = await this.find({
    isLogin: true,
    lastStatusCode: status,
  });

  const offlineUsers = await this.find({
    isLogin: false,
    lastStatusCode: status,
  });

  const wholeUserList = onlineUsers.concat(offlineUsers);
  const filteredUserList = wholeUserList.map((user) => {
    const { username, isLogin, lastStatusCode } = user;
    return { username, isLogin, lastStatusCode };
  });
  return filteredUserList;
};

// current user
const User = mongoose.model("User", userSchema);
module.exports = User;
