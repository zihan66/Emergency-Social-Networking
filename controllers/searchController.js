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
    const page = req.query.page;
    if (!page || page <= 0) {
      res.status(400).json({ message: "Invalid query" });
    }
    try {
      const result = await Message.searchPublicMessage(query, page * 10);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async searchAnnouncement(req, res) {
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ message: "Invalid query" });
    }
  }

  static async searchPrivateMessage(req, res) {
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ message: "Invalid query" });
    }
    const page = req.query.page;
    const chatID = req.query.chatId;
    if (!page || page <= 0 || !chatID) {
      res.status(400).json({ message: "Invalid query" });
    }
    try {
      const result = await Message.searchPrivateMessage(
        query,
        page * 10,
        chatID
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
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
