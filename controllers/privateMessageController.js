const moment = require("moment");
const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

class PrivateMessageController {
  // eslint-disable-next-line consistent-return
  static async getPrivateMessage(req, res) {
    let messges = [];

    const { username2 } = req.query;
    const { username: username1 } = req.cookies;
    const chat = await Chat.findOne({
      $and: [
        {
          $or: [
            { username1, username2 },
            { username1: username2, username2: username1 },
          ],
        },
      ],
    });

    try {
      if (!chat) {
        const currentChat = {
          chatID: new Date().getTime().toString(36),
          username1,
          username2,
        };
        await Chat.create(currentChat);
      } else {
        messges = await Message.find({ chatID: chat.chatID });
      }
    } catch (error) {
      return res.status(404).json({
        message: "username does not exist",
      });
    }
    res.status(200).json(messges);
  }

  static async createNewPrivateMessage(req, res) {
    try {
      const io = req.app.get("socketio");
      let {
        // eslint-disable-next-line prefer-const
        sendignUserName: username1,
        receivingUserName: username2,
        content,
        conversationId: chatID,
      } = req.body;
      if (!chatID) {
        const chat = await Chat.findOne({
          $and: [
            {
              $or: [
                { username1, username2 },
                { username1: username2, username2: username1 },
              ],
            },
          ],
        });
        chatID = chat.chatID;
      }
      const user = await User.findOne({ username: username1 });
      const currentMessage = {
        content,
        author: username1,
        target: username2,
        deliveryStatus: user.lastStatusCode,
        postedAt: moment().format(),
        chatID,
      };
      await Message.create(currentMessage);
      const message = await Message.find({ chatID });
      io.sockets.emit("privateMessage", message);
      res.status(201).json({});
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: "error" });
    }
  }

  static async getUserAllUnreadMsg(req, res) {
    const { username } = req.query;
    console.log("username", username);
    try {
      if (username) {
        
        const messges = await Message.find({
          target: username,
          unread: true,
        });
        res.status(200).json(messges);
      } else {
        return res.status(404).json({
          error: "user does not exist",
        });
      }
    } catch (error) {
      console.log("error", error);
      res.status(404).json({
        error: "user does not exist",
      });
    }
  }
}

module.exports = PrivateMessageController;
