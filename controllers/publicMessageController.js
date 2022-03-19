const moment = require("moment");
const Message = require("../models/message");
const User = require("../models/user");

class PublicMessageController {
  static async createNewPublicMessage(req, res) {
    try {
      const io = req.app.get("socketio");
      const user = await User.findOne({ username: req.body.username });
      console.log(user);
      const currentMessage = {
        content: req.body.content,
        author: req.body.username,
        deliveryStatus: user.lastStatusCode,
        postedAt: moment().format(),
      };
      console.log(currentMessage);
      await Message.create(currentMessage);
      io.sockets.emit("publicMessage", currentMessage);
      res.status(201).json({});
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: "error" });
    }
  }

  static async getPublicMessage(req, res) {
    try {
      const message = await Message.find({ chatID: { $exists: false } });
      res.status(200).json(message);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = PublicMessageController;
