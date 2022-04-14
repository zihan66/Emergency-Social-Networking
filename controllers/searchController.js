const User = require("../models/user");
const Message = require("../models/message").Message;
const Chat = require("../models/chat");
const Status = require("../models/status");
const MedicalSupply = require("../models/medicalSupply");

const removeStopWords = require("../lib/stopWords");
class searchController {
  static async searchUsername(req, res) {
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ message: "Invalid query" });
      return;
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
      return;
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
      return;
    }
    const page = req.query.page;
    if (!page || page <= 0) {
      res.status(400).json({ message: "Invalid query" });
      return;
    }
    let moreResult = false;
    const filteredContents = removeStopWords(query);
    if (filteredContents.length === 0) {
      res.status(200).json({ moreResult, result: [] });
      return;
    }
    try {
      const numberOfResult = page * 10 + 1;
      let result = await Message.searchPublicMessage(
        filteredContents,
        numberOfResult
      );
      if (result.length === numberOfResult) {
        moreResult = true;
        result.pop();
      }
      res.status(200).json({ moreResult, result });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async searchAnnouncement(req, res) {
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ message: "Invalid query" });
      return;
    }
    const page = req.query.page;
    if (!page || page <= 0) {
      res.status(400).json({ message: "Invalid query" });
      return;
    }
    let moreResult = false;
    const filteredContents = removeStopWords(query);
    if (filteredContents.length === 0) {
      res.status(200).json({ moreResult, result: [] });
      return;
    }
    try {
      const numberOfResult = page * 10 + 1;
      let result = await Message.searchAnnouncement(
        filteredContents,
        numberOfResult
      );
      if (result.length === numberOfResult) {
        moreResult = true;
        result.pop();
      }
      res.status(200).json({ moreResult, result });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async searchPrivateMessage(req, res) {
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ message: "Invalid query" });
      return;
    }
    const page = req.query.page;
    const chatID = req.query.chatId;
    if (!page || page <= 0 || !chatID) {
      res.status(400).json({ message: "Invalid query" });
      return;
    }
    let moreResult = false;
    const filteredContents = removeStopWords(query);
    if (filteredContents.length === 0)
      res.status(200).json({ moreResult, result: [] });
    try {
      const numberOfResult = page * 10 + 1;
      let result = await Message.searchPrivateMessage(
        filteredContents,
        numberOfResult,
        chatID
      );
      if (result.length === numberOfResult) {
        moreResult = true;
        result.pop();
      }
      res.status(200).json({ moreResult, result });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async searchStatus(req, res) {
    const query = req.query.q;
    const { chatId, page } = req.query;
    let moreResult = false;
    if (!query) {
      res.status(400).json({ message: "Invalid query" });
      return;
    }
    if (!page || page <= 0 || !chatId) {
      res.status(400).json({ message: "Invalid query" });
      return;
    }
    const numberOfResult = page * 10 + 1;
    try {
      const another = await Chat.findAnotherUser(req.cookies.username, chatId);
      let result = await Status.searchStatusHistory(another, numberOfResult);
      if (result.length === numberOfResult) {
        moreResult = true;
        result.pop();
      }
      res.status(200).json({ moreResult, result });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async searchMedicalSupply(req, res) {
    console.log("Enter searchMedicalSupply");
    const query = req.query.q;
    const searchContent = query.toLowerCase();
    console.log("searchContent",searchContent);
    const filteredContents = removeStopWords(searchContent);
    if (filteredContents.length === 0) {
      res.status(200).json([]);
      return;
    }
    
    try {
      const result = await MedicalSupply.findMedicalSupplyByName(searchContent);
      console.log("result", result);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

module.exports = searchController;
