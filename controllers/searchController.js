const User = require("../models/user");
const Message = require("../models/message").Message;

class searchController {
  static searchUsername(req, res) {
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ message: "Invalid query" });
    }
  }

  static searchUsersByStatus(req, res) {
    const { status } = req.query;
    const statusCodes = ["HELP", "EMERGENCY", "OK"];
    if (!statusCodes.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
    }
  }

  static searchPublicMessage(req, res) {
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ message: "Invalid query" });
    }
  }

  static searchAnnouncement(req, res) {
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ message: "Invalid query" });
    }
  }

  static searchPrivateMessage(req, res) {
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ message: "Invalid query" });
    }
  }

  static searchStatus(req, res) {
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ message: "Invalid query" });
    }
  }
}

module.exports = searchController;
