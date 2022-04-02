const moment = require("moment");
const normalStrategy = require("../lib/announcementMessageStrategy").normalStrategy;
const User = require("../models/user");
const socket = require("../socket");
class AnnouncementMessageController {
  constructor(strategy) {
    this.strategy = strategy;
    this.createNewAnnouncementMessage = this.createNewAnnouncementMessage.bind(this);
    this.getAnnouncementMessage = this.getAnnouncementMessage.bind(this);
  }

  async createNewAnnouncementMessage(req, res) {
    try {
      const io = socket.getInstance();
      const user = await User.findOne({ username: req.body.username });
      const currentMessage = {
        content: req.body.content,
        author: req.body.username,
        deliveryStatus: user.lastStatusCode,
        postedAt: moment().format(),
        type: "announcement",
      };
      console.log(this);
      await this.strategy.createMessage(currentMessage);
      io.sockets.emit("announcementMessage", currentMessage);
      res.status(201).json({});
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: "error" });
    }
  }

  async getAnnouncementMessage(req, res) {
    try {
      const message = await this.strategy.getMessages();
      res.status(200).json(message);
    } catch (error) {
      console.log(error);
    }
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }
}
const ns = new normalStrategy();
announcementMessageController = new AnnouncementMessageController(ns);

module.exports = announcementMessageController;
