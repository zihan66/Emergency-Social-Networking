const Message = require("../models/message").Message;
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
    const messages = await Message.find({ type: "public" });
    return messages;
  }
}

class testStrategy {
  constructor() {
    this.createMessage = this.createMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  async createMessage(message) {
    await MessageTest.create(message);
    console.log("inside test");
  }

  async getMessages() {
    const messages = await MessageTest.find({ type: "public" });
    return messages;
  }
}

exports.normalStrategy = normalStrategy;
exports.testStrategy = testStrategy;
