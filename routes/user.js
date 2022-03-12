const express = require("express");
const joinController = require("../controllers/joinController");
const loginLogoutController = require("../controllers/loginLogoutController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.put("/:username/online", loginLogoutController.login);
router.put("/:username/offline", loginLogoutController.logout);
router.get("/", loginLogoutController.getAllUsers);
router.post("/", joinController.join);
router.put(
  "/users/:username/acknowledgement",
  auth,
  joinController.acknowledge
);

module.exports = router;
