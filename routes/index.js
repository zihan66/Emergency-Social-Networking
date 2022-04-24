const express = require("express");
const userRoute = require("./user");
const messageRoute = require("./message");
const chatRoute = require("./chat");
const searchRoute = require("./search");
const peformanceRoute = require("./performance");
const eventRoute = require("./event");
const medicalSupplyRoute = require("./medicalSupply");
const blogRoute = require("./blog");
const suspend = require("../middlewares/suspend");
const auth = require("../middlewares/auth");
const canAskForDonor = require("../middlewares/canAskForDonor");
const canBeDonor = require("../middlewares/canBeDonor");
const administratorPrivilege = require("../middlewares/administratorPrivilege");

const router = express.Router();
/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "homepage" });
});

router.get("/signUp", (req, res) => {
  res.render("signUp", { title: "SignUp" });
});

router.get("/publicWall", suspend, auth, (req, res) => {
  res.render("publicWall", { title: "publicWall" });
});

router.get("/blogWall", suspend, auth, (req, res) => {
  res.render("blogWall", { title: "blogWall" });
});

router.get("/announcement", auth, (req, res) => {
  const isAdmin =
    req.cookies.privilege && req.cookies.privilege === "administrator";
  console.log(isAdmin);
  res.render("announcement", { title: "announcement", isAdmin: isAdmin });
});

router.get("/welcome", auth, (req, res) => {
  res.render("welcome", { username: req.cookies.username });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "login" });
});

router.get("/directory", auth, (req, res) => {
  res.render("directory", { title: "directory" });
});

router.get("/directoryForAdmin", auth, (req, res) => {
  res.render("directoryForAdmin", { title: "directoryForAdmin" });
});

router.get("/newDonor", auth, canBeDonor, (req, res) => {
  res.render("newDonor", { title: "newDonor" });
});

router.get("/askForDonor", auth, canAskForDonor, (req, res) => {
  res.render("askForDonor", { title: "askForDonor" });
});

router.get("/blog/newBlog", auth, (req, res) => {
  res.render("newBlog", { title: "newBlog" });
});

router.get("/chatroom/:chatid/:target", auth, (req, res) => {
  res.render("chatRoom", { title: "chatRoom" });
});

router.use("/users", suspend, userRoute);

router.get("/measure", auth, administratorPrivilege, (req, res) => {
  res.render("measure", { title: "measure" });
});

router.get("/searchPage/:criteria", (req, res) => {
  res.render("search", { title: "search" });
});
router.get("/searchPage/:criteria/:chatID/:username", (req, res) => {
  res.render("search", { title: "search" });
});

router.get("/eventWall", auth, (req, res) => {
  res.render("eventWall", { title: "eventWall" });
});

router.get("/myEvent", auth, (req, res) => {
  res.render("myEvent", { title: "myEvent" });
});

router.get("/myEvent/newEvent", auth, (req, res) => {
  res.render("newEvent", { title: "newEvent" });
});

router.get("/provideMedicalSupply", auth, (req, res) => {
  res.render("medicalSupply", { title: "medicalSupply" });
});
router.get("/reserveMedicalSupply", auth, (req, res) => {
  res.render("medicalSupplyReservation", { title: "medicalSupplyReservation" });
});

router.use("/users", userRoute);
router.use("/messages", messageRoute);
router.use("/chats", suspend, chatRoute);
router.use("/performances", peformanceRoute);
router.use("/search", suspend, searchRoute);
router.use("/events", suspend, eventRoute);
router.use("/medicalSupplies", medicalSupplyRoute);

router.use("/blog", blogRoute);

module.exports = router;
