const mongoose = require("mongoose");

// establish database connection
const userSchema = new mongoose.Schema({
  username: { type: String, default: "", trim: true }, // trim: true will remove all leading and trailing spaces
  password: { type: String, default: "", trim: true }, // trim: true will remove all leading and trailing spaces
});

// current user
module.exports = { userSchema };
