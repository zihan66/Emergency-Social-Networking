require("dotenv").config();
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

router.get("/welcome", (req, res) => {
  res.render("welcome", { title: "Home" });
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
        },
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

// TODO send json

// post user register page, given that the user is new
router.post("/register", async (req, res) => {
  const user = req.body;
  console.log("req: POST /register", user);
  try {
    user.username = user.username.toLowerCase();
    const one = await User.find({ username: user.username });
    if (one.length > 0) {
      res.json({
        status: false,
        message: "user has already exists",
      });
      // .status(200)
      // .json({ status: "error", message: "username already exists" });
      return;
    }
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    // res.status(200).send({ user: result });
    const token = jwt.sign({
      id: String(newUser._id),
    }, process.env.TOKEN_SECRET, {expiresIn: "1h" });
    res.json({
      status: true,
      jwtToken: token,
    });
  } catch (e) {
    res.status(200).send({ error: "error" });
  }
});

const auth = async (req, res, next) => {
  const token = String(req.headers.authorization).split(" ").pop();
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.json({
        status: false,
        message: "token does not exist or has expired",
      });
    // eslint-disable-next-line no-empty
    } else {
      console.log(decoded);
      next();
    }
  });
};

router.get("/welcome", auth, async (req, res) => {
  res.send("welcome");
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
