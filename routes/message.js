const express = require("express");
const router = express.Router();
const publicMessageController = require("../controllers/publicMessageController");
const privateMessageController = require("../controllers/privateMessageController");

router.post("/public", publicMessageController.createNewPublicMessage);
router.get("/public", publicMessageController.getPublicMessage);

// eslint-disable-next-line consistent-return
router.get("/private", privateMessageController.getPrivateMessage);

router.post("/private", privateMessageController.createNewPrivateMessage);
router.get(
  "/private/unread/:username",
  privateMessageController.getUserAllUnreadMsg
);
router.put("/private/:messageId/unread", privateMessageController.readMessage);

module.exports = router;
