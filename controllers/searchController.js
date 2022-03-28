const User = require("../models/user");
const Message = require("../models/message").Message;
const stopWords = require("../lib/stopWords");
class searchController {
  static async searchUsername(req, res) {
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ message: "Invalid query" });
    }
    try {
      const result = await User.searchUsersByUsername(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async searchUsersByStatus(req, res) {
    const { status } = req.query;
    const statusCodes = ["HELP", "EMERGENCY", "OK"];
    if (!statusCodes.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
    }
    try {
      const result = await User.findUserByStatus(status);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async searchPublicMessage(req, res) {
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

  static removeStopWords(searchContent) {
    const contents = searchContent.split(" ");
    for (word of contents) {
    }
  }
}

module.exports = searchController;
