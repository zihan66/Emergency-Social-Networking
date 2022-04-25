const express = require("express");
const router = express.Router();
const publicMessageController = require("../controllers/publicMessageController");
const privateMessageController = require("../controllers/privateMessageController");
const announcementMessageController = require("../controllers/announcementMessageController");

const suspend = require("../middlewares/suspend");


router.post("/public", publicMessageController.createNewPublicMessage);
router.get("/public", publicMessageController.getPublicMessage);
router.post(
  "/announcement",
  suspend,
  announcementMessageController.createNewAnnouncementMessage
);
router.get(
  "/announcement",
  suspend,
  announcementMessageController.getAnnouncementMessage
);

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
