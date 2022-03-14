const express = require("express");

const router = express.Router();
const publicMessageController = require("../controllers/publicMessageController");
const privateMessageController = require("../controllers/privateMessageController");

router.post("/messages/public", publicMessageController.createNewPublicMessage);
router.get("/messages/public", publicMessageController.getPublicMessage);

// eslint-disable-next-line consistent-return
router.get("/messages/private", privateMessageController.getPrivateMessage);

router.post("/messages/private", privateMessageController.createNewPrivateMessage);
router.get("/messages/private/unread", privateMessageController.getUserAllUnreadMsg);

module.exports = router;
