const express = require("express");
const router = express.Router();
const privateMessageController = require("../controllers/privateMessageController");

router.post("/", privateMessageController.createNewPrivateChat);
router.get("/", privateMessageController.getUserAllChats);

module.exports = router;
