const express = require("express");
const router = express.Router();
const publicMessageController = require("../controllers/publicMessageController");
const privateMessageController = require("../controllers/privateMessageController");
const suspend = require("../middlewares/suspend");

router.post("/public", publicMessageController.createNewPublicMessage);
router.get("/public", publicMessageController.getPublicMessage);

// eslint-disable-next-line consistent-return
router.get("/private", suspend, privateMessageController.getPrivateMessage);

router.post(
  "/private",
  suspend,
  privateMessageController.createNewPrivateMessage
);
router.get(
  "/private/unread",
  suspend,
  privateMessageController.getUserAllUnreadMsg
);
router.put(
  "/private/:messageId/unread",
  suspend,
  privateMessageController.readMessage
);

module.exports = router;
