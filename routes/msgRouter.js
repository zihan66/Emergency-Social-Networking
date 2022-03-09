const express = require("express");

const router = express.Router();
const publicMessageController = require("../controllers/publicMessageController");
const privateMessageController = require("../controllers/privateMessageController");
const Chat = require("../models/chat");


router.post("/messages/public", publicMessageController.createNewPublicMessage);
router.get("/messages/public", publicMessageController.getPublicMessage);

// eslint-disable-next-line consistent-return
router.get("/messages/private", async (req, res) => {
//   const chatId = req.query.chat_id;
  let messges = [];
  const { username2 } = req.query;
  const { username: username1 } = req.cookies;
  const chat = await Chat.findOne({
    $and: [
      {
        $or: [{ username1, username2 }, { username1: username2, username2:username1 }],
      },
    ],
  });
  console.log("chat", chat);
  try {
    if (!chat) {
      privateMessageController.createNewPrivateId({ username1, username2 });
    } else {
      messges = await privateMessageController.getPrivateMessage(chat.chatID);
    }
  } catch (error) {
    return res.status(404).json({
      message: "username does not exist",
    });
  }
  console.log("debug_messges", messges);
  res.status(200).json(messges);
//   res.render("privateWall", { title: "privateWall", messges });
});

router.post("/messages/private", privateMessageController.createNewPrivateMessage);

module.exports = router;
