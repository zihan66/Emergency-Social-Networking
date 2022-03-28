const moment = require("moment");
const Message = require("../models/message").Message;
const User = require("../models/user");
const Chat = require("../models/chat");
const socket = require("../socket");
class PrivateMessageController {
  static async createNewPrivateChat(req, res) {
    try {
      const { username1, username2 } = req.body;
      if (username1 === undefined || username2 === undefined) {
        console.log("undefined");
        res.status(404).json({});
        return;
      }
      const existedChat = await Chat.findChatBetweenTwoUsers(
        username1,
        username2
      );
      console.log(existedChat);
      if (existedChat) {
        console.log("existed");
        res.status(404).json({});
        return;
      }
      const currentChat = {
        chatID: new Date().getTime().toString(36),
        username1,
        username2,
      };
      const response = await Chat.create(currentChat);
      res.location(`/chatRoom/${currentChat.chatID}/${username2}`);
      res.status(201).json();
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error });
    }
  }
  //eslint-disable-next-line consistent-return
  static async getPrivateMessage(req, res) {
    const { chatID } = req.query;
    const chat = await Chat.findOne({
      chatID,
    });

    try {
      if (!chat) {
        res.status(404).json();
      }
      await Message.update(
        { chatID, unread: true, target: req.cookies.username },
        { $set: { unread: false } }
      );
      const messages = await Message.find({ chatID });
      res.status(200).json({ messages });
    } catch (error) {
      res.status(404).json({
        message: "ChatID does not exist",
      });
    }
  }

  static async createNewPrivateMessage(req, res) {
    try {
      const io = socket.getInstance();
      console.log(socket.hasName);
      const { author, target, content, chatID } = req.body;
      const chat = await Chat.findOne({
        chatID,
      });
      const authorUser = await User.findOne({ username: author });
      const targetUser = await User.findOne({ username: target });
      if (chat == null || authorUser == null || targetUser == null) {
        res.status(404).json({});
        return;
      }
      const currentMessage = {
        content,
        author: authorUser.username,
        target: targetUser.username,
        deliveryStatus: authorUser.lastStatusCode,
        postedAt: moment().format(),
        chatID,
        type: "private",
      };
      await Message.create(currentMessage);
      const authorSocketId = socket.hasName[authorUser.username];
      const targetSocketId = socket.hasName[targetUser.username];
      io.sockets.to(authorSocketId).emit("privateMessage", currentMessage);
      if (targetSocketId !== undefined)
        io.sockets.to(targetSocketId).emit("privateMessage", currentMessage);

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
        return;
      }
      const chats = await Chat.findChatsOfUser(username);
      const result = chats.map((chat) => {
        const { username1, username2, chatID } = chat;
        if (username1 === username) {
          return { username: username2, chatID };
        } else {
          return { username: username1, chatID };
        }
      });
      res.status(200).json({ chats: result });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "error" });
    }
  }

  static async getUserAllUnreadMsg(req, res) {
    console.log("hello");
    const { username } = req.query;
    console.log("username", username);
    try {
      if (username) {
        const messages = await Message.find({
          target: username,
          unread: true,
        });
        const msgs = messages.map((msg) => {
          return { chatID: msg.chatID, username: msg.author };
        });
        res.status(200).json(msgs);
        return;
      } else {
        res.status(404).json({
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

  static async readMessage(req, res) {
    const { messageId } = req.params;
    try {
      await Message.updateOne({ _id: messageId }, { unread: False });
      res.status(200).json();
    } catch (error) {
      console.error("error", error);
      res.status(500).send();
    }
  }
}

module.exports = PrivateMessageController;
