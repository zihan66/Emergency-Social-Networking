const express = require("express");

const chatController = require("../controllers/chatController");

const router = express.Router();

router.get("/chatlist", chatController.getChatList);

module.exports = router;
