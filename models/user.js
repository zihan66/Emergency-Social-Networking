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
  lastStatusUpdateTime: {type: String, default: "unknownTime"},
});

// current user
const User = mongoose.model("User", userSchema);
module.exports = User;
