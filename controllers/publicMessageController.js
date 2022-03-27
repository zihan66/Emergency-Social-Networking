const moment = require("moment");
const normalStrategy = require("../lib/publicMessageStrategy").normalStrategy;
const User = require("../models/user");
const socket = require("../socket");
class PublicMessageController {
  constructor(strategy) {
    this.strategy = strategy;
    this.createNewPublicMessage = this.createNewPublicMessage.bind(this);
    this.getPublicMessage = this.getPublicMessage.bind(this);
  }

  async createNewPublicMessage(req, res) {
    try {
      const io = socket.getInstance();
      const user = await User.findOne({ username: req.body.username });
      const currentMessage = {
        content: req.body.content,
        author: req.body.username,
        deliveryStatus: user.lastStatusCode,
        postedAt: moment().format(),
        type: "public",
      };
      console.log(this);
      await this.strategy.createMessage(currentMessage);
      io.sockets.emit("publicMessage", currentMessage);
      res.status(201).json({});
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: "error" });
    }
  }

  async getPublicMessage(req, res) {
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
publicMessageController = new PublicMessageController(ns);

module.exports = publicMessageController;
