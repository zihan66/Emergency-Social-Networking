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
      res.status(200).json({
        jwtToken: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }

  static async logout(req, res) {
    const user = req.params;
    const io = socket.getInstance();
    console.log("req: POST /logout", user);
    try {
      let result = await User.findOne({ username: user.username });
      if (result) {
        await User.updateOne({ username: user.username }, { isLogin: false });
        const userList = await User.findAllUsers();
        io.emit("userList", userList);
        res.clearCookie("jwtToken");
        res.clearCookie("username");

        res.status(200).json({});
      }
    } catch (e) {
      res.status(200).send({ status: false, message: e.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const userList = await User.findAllUsers();
      res.status(200).json(userList);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = loginLogoutController;
