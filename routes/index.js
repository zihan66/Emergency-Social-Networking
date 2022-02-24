const express = require("express");
const joinController = require("../controllers/joinController");
const loginLogoutController = require("../controllers/loginLogoutController");
const publicMessageController = require("../controllers/publicMessageController");
const auth = require("../middlewares/auth");

const router = express.Router();
/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "homepage" });
});

router.get("/signUp", (req, res) => {
  res.render("signUp", { title: "SignUp" });
});

router.get("/publicWall", auth, (req, res) => {
  res.render("publicWall", { title: "publicWall" });
});

router.post(
  "/messages/public",
  auth,
  publicMessageController.createNewPublicMessage
);
router.get("/messages/public", auth, publicMessageController.getPublicMessage);
router.get("/welcome", auth, (req, res) => {
  res.render("welcome");
});

router.get("/login", (req, res) => {
  res.render("login", { title: "login" });
});

router.get("/directory", auth, (req, res) => {
  res.render("directory", { title: "directory" });
});

router.put(
  "/users/:username/acknowledgement",
  auth,
  joinController.acknowledge
);
router.put("/users/:username/online", auth, loginLogoutController.login);
router.put("/users/:username/offline", auth, loginLogoutController.logout);
router.get("/users", auth, loginLogoutController.getAllUsers);
router.post("/users", auth, joinController.join);

module.exports = router;
