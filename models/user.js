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
});

// current user
const User = mongoose.model("User", userSchema);
module.exports = User;
