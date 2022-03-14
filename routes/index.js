const express = require("express");
const joinController = require("../controllers/joinController");
const loginLogoutController = require("../controllers/loginLogoutController");
const auth = require("../middlewares/auth");

const router = express.Router();
/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "homepage" });
});

router.get("/signUp", (req, res) => {
  res.render("signUp", { title: "SignUp" });
});

router.get("/publicWall", (req, res) => {
  res.render("publicWall", { title: "publicWall" });
});

router.get("/privateWall", (req, res) => {
  res.render("privateWall", { title: "privateWall" });
});

router.get("/unreadWall", (req, res) => {
  res.render("unreadWall", { title: "unreadWall" });
});

router.get("/welcome", (req, res) => {
  res.render("welcome");
});

router.get("/login", (req, res) => {
  res.render("login", { title: "login" });
});

router.get("/directory", (req, res) => {
  res.render("directory", { title: "directory" });
});

router.put(
  "/users/:username/acknowledgement",
  auth,
  joinController.acknowledge
);
router.put("/users/:username/online", loginLogoutController.login);
router.put("/users/:username/offline", loginLogoutController.logout);
router.get("/users", loginLogoutController.getAllUsers);
router.post("/users", joinController.join);

module.exports = router;
