const express = require("express");

const router = express.Router();
const publicChatController = require("../controllers/publicChatContoller");

router.get("/messages/public", publicChatController.getPublicMessage);

module.exports = router;
