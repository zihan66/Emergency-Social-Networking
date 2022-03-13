const moment = require("moment");
const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

class PrivateMessageController {
  static async createNewPrivateChat(req, res) {
    try {
      console.log(req.body);
      const { username1, username2 } = req.body;
      if (username1 === undefined || username2 === undefined)
        res.status(404).json({});
      const currentChat = {
        chatID: new Date().getTime().toString(36),
        username1,
        username2,
      };
      await Chat.create(currentChat);
      res.status(201).json();
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error });
    }
  }

  static async getPrivateMessage(chatId) {
    let message = [];
    try {
      message = await Message.find({ chatID: chatId });
      console.log("message", message, chatId);
    } catch (error) {
      console.log(error);
    }
    return message;
  }

  static async createNewPrivateMessage(req, res) {
    try {
      const io = req.app.get("socketio");
      let {
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
      console.log(user);
      const currentMessage = {
        content,
        author: username1,
        deliveryStatus: user.lastStatusCode,
        postedAt: moment().format(),
        chatID,
      };
      console.log(currentMessage);
      await Message.create(currentMessage);
      const message = await Message.find({ chatID });
      io.sockets.emit("privateMessage", message);
      res.status(201).json({});
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: "error" });
    }
  }

  static async getUserAllChats(req, res) {
    try {
      const { username } = req.query;
      console.log(req.params);
      if (!username) {
        res.status(400).send({ error: "error" });
      }
      const existedUser = await User.findOne({
        username,
      });
      if (!existedUser) {
        res.status(404).json({
          message: "username does not exist",
        });
      }
      const chats = await Chat.findChatsOfUser(username);
      const result = chats.map((chat) => {
        const { username1, username2, chatID } = chat;
        if (username1 === username) {
          return { username: username2, chatId: chatID };
        } else {
          return { username: username1, chatId: chatID };
        }
      });
      res.status(200).json({ chats: result });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "error" });
    }
  }
}

module.exports = PrivateMessageController;
