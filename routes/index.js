const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { userSchema } = require("../models/user");
const resevedUsernameList = require("./reservedUsernameList");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "Login" });
});

router.get("/signUp", (req, res) => {
  res.render("signUp", { title: "SignUp" });
});

// router.get("/register", (req, res) => {
//   res.render("register", { title: "Register" });
// });

router.get("/home", (req, res) => {
  res.render("home", { title: "Home" });
});

// establish database connection
mongoose.connect("mongodb://localhost:27017/citizen");

// current user
const User = mongoose.model("User", userSchema);

// post user login page, given that the user already exists
router.post("/login", async (req, res) => {
  const user = req.body;
  console.log("req: POST /login", user);
  try {
    if (!user.username || !user.password) {
      res
        .status(200)
        .send({ status: "error", message: "username or password is empty" });
      return;
    }
    if (user.username.length < 4) {
      res.status(200).send({
        status: "error",
        message: "username too short, should be at least 4 characters long.",
      });
      return;
    }
    if (resevedUsernameList.includes(user.username)) {
      res.status(200).send({
        status: "error",
        message: "username is reserved, please choose another one.",
      });
      return;
    }
    user.username = user.username.toLowerCase();
    const result = await User.findOne(user);
    if (result) {
      jwt.sign(
        { username: user.username },
        "secret",
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            res
              .status(200)
              .send({ status: "error", message: "internal error" });
            return;
          }
          res.status(200).send({ status: "success", token });
        }
      );
    } else {
      res
        .status(200)
        .send({ status: "error", message: "username or password is wrong" });
    }
  } catch (e) {
    res.status(200).send({ status: "error", message: e.message });
  }
});

// post user register page, given that the user is new
router.post("/register", async (req, res) => {
  const user = req.body;
  console.log("req: POST /register", user);
  try {
    if (!user.username || !user.password) {
      res
        .status(200)
        .send({ status: "error", message: "username or password is empty" });
      return;
    }
    if (user.username.length < 4) {
      res.status(200).send({
        status: "error",
        message: "username too short, should be at least 4 characters long.",
      });
      return;
    }
    if (resevedUsernameList.includes(user.username)) {
      res.status(200).send({
        status: "error",
        message: "username is reserved, please choose another one.",
      });
      return;
    }
    if (user.password.length < 4) {
      res.status(200).send({
        status: "error",
        message: "password too short, should be at least 4 characters long.",
      });
      return;
    }
    user.username = user.username.toLowerCase();
    const one = await User.find({ username: user.username });
    console.log(one);
    if (one.length > 0) {
      res
        .status(200)
        .send({ status: "error", message: "username already exists" });
      return;
    }
    const result = await User.create(user);
    res.status(200).send({ user: result });
  } catch (e) {
    res.status(200).send({ error: "error" });
  }
});

// check token
router.get("/check", (req, res) => {
  jwt.verify(req.headers.authorization, "secret", (err, decoded) => {
    if (err) {
      res.status(200).send({ status: "error", message: "token is invalid" });
      return;
    }
    const expire = decoded.exp - Math.floor(Date.now() / 1000);
    if (expire < 0) {
      res.status(200).send({ status: "error", message: "token is expired" });
      return;
    }
    const user = User.findOne({ username: decoded.username });
    if (user) {
      res.status(200).send({ status: "success", username: decoded.username });
    } else {
      res.status(200).send({ status: "error", message: "token is invalid" });
    }
  });
});

module.exports = router;
