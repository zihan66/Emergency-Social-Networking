const moment = require("moment");
const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

class PrivateMessageController {
  static async createNewPrivateId({ username1, username2 }) {
    const currentChat = {
      chatID: new Date().getTime().toString(36),
      username1,
      username2,
    };
    await Chat.create(currentChat);
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
        conversationId:chatID } =
        req.body;
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
}

module.exports = PrivateMessageController;
