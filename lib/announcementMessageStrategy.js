const Message = require("../models/message").Message;
const MessageTest = require("../models/message").MessageTest;
const User = require("../models/user");

class normalStrategy {
  constructor() {
    this.createMessage = this.createMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  async createMessage(message) {
    await Message.create(message);
  }

  async getMessages() {
    const users = await User.find({ accountStatus : "active"});
    const filteredUserList = users.map( user => {
      return user.username;
    });
    console.log("User!!!!",filteredUserList);
    const activeMessage = await Message.find({author:{$in: filteredUserList}, type:"announcement"});
    console.log("message", activeMessage);
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
    const messages = await MessageTest.find({ type: "announcement" });
    return messages;
  }
}

exports.normalStrategy = normalStrategy;
exports.testStrategy = testStrategy;
