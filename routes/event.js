const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.post("/", eventController.createNewEvent);
router.get("/", eventController.getPublicEvent);
router.get("/:username", eventController.getEventByHost);
router.delete("/:eventId", eventController.deleteEvent);
router.put("/:eventId/join", eventController.join);
router.put("/:eventId/unjoin", eventController.unjoin);

module.exports = router;
