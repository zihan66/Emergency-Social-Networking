const Message = require("../models/message").Message;
const User = require("../models/user");
const MessageTest = require("../models/message").MessageTest;

class normalStrategy {
  constructor() {
    this.createMessage = this.createMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  async createMessage(message) {
    await Message.create(message);
  }

  async getMessages() {
    const users = await User.find({ accountStatus: "active" });
    const filteredUserList = users.map((user) => {
      return user.username;
    });
    const activeMessage = await Message.find({
      author: { $in: filteredUserList },
      type: "public",
    });

    return activeMessage;
  }
}

class testStrategy {
  constructor() {
    this.createMessage = this.createMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  async createMessage(message) {
    await MessageTest.create(message);
  }

  async getMessages() {
    const messages = await MessageTest.find({ type: "public" });
    return messages;
  }
}

exports.normalStrategy = normalStrategy;
exports.testStrategy = testStrategy;
