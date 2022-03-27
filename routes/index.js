const express = require("express");
const userRoute = require("./user");
const messageRoute = require("./message");
const chatRoute = require("./chat");
const searchRoute = require("./search");
const peformanceRoute = require("./performance");
const suspend = require("../middlewares/suspend");
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

router.get("/welcome", auth, (req, res) => {
  res.render("welcome");
});

router.get("/login", (req, res) => {
  res.render("login", { title: "login" });
});

router.get("/directory", auth, (req, res) => {
  res.render("directory", { title: "directory" });
});

router.get("/chatroom/:chatid/:target", auth, (req, res) => {
  res.render("chatRoom", { title: "chatRoom" });
});

router.use("/users", suspend, userRoute);
router.use("/messages", messageRoute);
router.use("/chats", suspend, chatRoute);
router.use("/performances", peformanceRoute);
router.use("/search", suspend, searchRoute);

module.exports = router;
