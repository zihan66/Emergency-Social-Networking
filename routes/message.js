const express = require("express");

const router = express.Router();
const publicMessageController = require("../controllers/publicMessageController");

router.post("/public", publicMessageController.createNewPublicMessage);
router.get("/public", publicMessageController.getPublicMessage);

module.exports = router;
