require("dotenv").config();

const Message = require("../models/message");

class ChatController {
  static async getChatList(req, res) {
    try {
      const result = await Message.find();
      // eslint-disable-next-line no-array-constructor
      let temp = new Array();
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < result.length; i++) {
        temp.push({
          message: result[i].message,
          username: result[i].username,
          time: result[i].time,
        });
      }
      temp = JSON.stringify(temp);
      res.status(200).send({ chatlist: temp });
    } catch (e) {
      res.status(200).send({ error: "error" });
    }
  }

  static async acknowledge(req, res) {
    console.log("enter acknowledgement");
    try {
      // eslint-disable-next-line max-len
      const acknowledge = await User.updateOne(
        { username: req.params.username },
        { isAcknowledge: true }
      );
      console.log("acknowlege", acknowledge);
      res.location("/directory");
      res.status(200).json();
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = ChatController;
