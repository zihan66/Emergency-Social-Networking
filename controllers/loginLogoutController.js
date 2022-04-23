require("dotenv").config();
const brypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const socket = require("../socket");
const User = require("../models/user");

class loginLogoutController {
  static async login(req, res) {
    try {
      const user = await User.findOne({ username: req.params.username });

      const io = socket.getInstance();
      if (!user) {
        return res.status(404).json({
          message: "username does not exist",
        });
      }
      if (user.accountStatus === "inactive") {
        return res.status(401).json({
          message: "Account Status is inactive",
        });
      }
      await User.updateOne(
        { username: "ESNAdmin" },
        { privilege: "administrator", lastStatusCode: "OK" }
      );

      const isPasswordValid = brypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          error: "password is wrong",
        });
      }

      const token = jwt.sign(
        {
          id: String(user._id),
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "24h" }
      );
      if (user.isAcknowledge === false) {
        res.location("/welcome");
      } else {
        res.location("/directory"); //here should be Directory
      }

      let result = await User.updateOne(
        { username: req.params.username },
        { isLogin: true }
      );
      // user login successfully, update the userlist and send it to front-end
      const userList = await User.findAllUsers();
      io.emit("userList", userList);
      res.cookie("jwtToken", token);
      res.cookie("username", req.params.username);
      res.cookie("isDonor", user.isDonor);
      res.cookie("bloodType", user.bloodType);
      res.cookie("lastStatusCode", user.lastStatusCode);
      res.cookie("privilege", user.privilege);
      res.status(200).json({
        jwtToken: token,
      });
    } catch (error) {}
  }

  static async logout(req, res) {
    const user = req.params;
    const io = socket.getInstance();
    try {
      let result = await User.findOne({ username: user.username });
      await User.updateOne({ username: user.username }, { isLogin: false });
      const userList = await User.findAllUsers();
      io.emit("userList", userList);
      res.clearCookie("jwtToken");
      res.clearCookie("username");

      res.status(200).json({});
    } catch (e) {}
  }

  static async getAllUsers(req, res) {
    try {
      const userList = await User.findAllUsers();
      res.status(200).json(userList);
    } catch (error) {}
  }
}
module.exports = loginLogoutController;
