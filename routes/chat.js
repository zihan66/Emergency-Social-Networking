const express = require("express");
const mongoose = require("mongoose");
const  = require("../models/user");
const { messageSchema } = require("../models/message");

const router = express.Router();

// establish database connection
mongoose.connect("mongodb://127.0.0.1:27017/citizen");

// current user
const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);


router.get("/chatlist", async (req, res) => {
  try {
    const result = await Message.find();
    let temp = new Array();
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
});

router.post("/send", async (req, res, next) => {
  try {
    const message = req.body;
    console.log("req: POST /send", message);
    const newMessage = await Message.create({
      message: req.body.message,
      username: req.body.username,
      time: req.body.time,
    });
    res.status(200).send({ status: "success" });
  } catch (e) {
    res.status(200).send({ error: "error" });
  }
});

module.exports = router;
