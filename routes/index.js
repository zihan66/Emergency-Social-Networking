const express = require("express");
const userRoute = require("./user");
const messageRoute = require("./message");
const chatRoute = require("./chat");
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

router.get("/chatroom/:chatid/:target", (req, res) => {
  res.render("chatRoom", { title: "chatRoom" });
});

router.get("/searchPage/:criteria", (req, res) => {
  res.render("search", { title: "search" });
});
router.get("/searchPage/:criteria/:chatID", (req, res) => {
  res.render("search", { title: "search" });
});
// router.get("/search/status", (req, res) => {
//   res.render("search", { title: "search" });
// });

router.get("/searchusername", (req,res) => {
  //alert("aaa");
  res.json([{username:"jiacheng", status:"OK", isLogin: true},
  {username:"jiacheng1", status:"HELP", isLogin: false},
  {username:"jiacheng122", status:"EMERGENCY", isLogin: false}])
});


router.get("/search/status/:page", (req,res) => {
  //alert("aaa");
  res.json([{username:"jiacheng1", statusCpde:"OK", updatedAt: "2022-03-26T22:29:43-07:00"},
  {username:"jiacheng2", status:"HELP", updatedAt: "2022-03-26T22:29:43-07:00"},
  {username:"jiacheng3", status:"EMERGENCY", updatedAt: "2022-03-26T22:29:43-07:00"}])
})

router.get("/search/:page", (req,res) => {
  res.json([{"content":"hello",
  "unread":true,
  "_id":"623ff647364812152252fe97",
  "author":"jiacheng",
  "deliveryStatus":"HELP",
  "postedAt":"2022-03-26T22:29:43-07:00",
  "__v":0},
  {"content":"how are you",
  "unread":true,"_id":"6240224c1abedd3ac0938130","author":"user1","deliveryStatus":"OK","postedAt":"2022-03-27T01:37:32-07:00","__v":0}])
})


router.use("/users", userRoute);
router.use("/messages", messageRoute);
router.use("/chats", chatRoute);

module.exports = router;
