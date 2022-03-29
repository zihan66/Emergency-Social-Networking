const mongoose = require("mongoose");
// establish database connection
const statusSchema = new mongoose.Schema({
  username: { type: String, trim: true }, // trim: true will remove all leading and trailing spaces
  statusCode: { type: String, default: "unknown" },
  updatedAt: { type: String },
});

// current user
const Status = mongoose.model("Status", statusSchema);

module.exports = Status;
