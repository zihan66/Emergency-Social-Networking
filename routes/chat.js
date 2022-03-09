const express = require("express");
const { Message } = require("../models/message");

const router = express.Router();

// establish database connection

router.get("/chatlist", async (req, res) => {
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
