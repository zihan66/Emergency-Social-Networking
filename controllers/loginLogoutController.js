require("dotenv").config();
const brypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

class loginLogoutController {
  static async login(req, res) {
    try {
      const user = await User.findOne({ username: req.params.username });
      const io = req.app.get("socketio");
      console.log("login user", user);
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
        return res.status(404).json({
          error: "user does not exist",
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

      result = await User.find();

      let onlineUsers = await User.find({ isLogin: true }).sort({
        username: 1,
      });
      let offlineUsers = await User.find({ isLogin: false }).sort({
        username: 1,
      });
      const wholeUserList = onlineUsers.concat(offlineUsers);
      const filteredUserList = wholeUserList.map((user) => {
        const { username: name, isLogin } = user;
        return { username: name, isLogin };
      });
      io.emit("userList", filteredUserList);

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
    const io = req.app.get("socketio");
    console.log("req: POST /logout", user);
    try {
      let result = await User.findOne({ username: user.username });
      if (result) {
        await User.updateOne({ username: user.username }, { isLogin: false });

        result = await User.find();
        console.log;
        let onlineUsers = await User.find({ isLogin: true }).sort({
          username: 1,
        });
        let offlineUsers = await User.find({ isLogin: false }).sort({
          username: 1,
        });
        const wholeUserList = onlineUsers.concat(offlineUsers);
        const filteredUserList = wholeUserList.map((user) => {
          const { username: name, isLogin } = user;
          return { username: name, isLogin };
        });

        io.emit("userList", filteredUserList);
        res.clearCookie("jwtToken");
        res.clearCookie("username");
        // res.cookie("express.sid", "", { expires: new Date() });

        res.status(200).json({});
      }
    } catch (e) {
      res.status(200).send({ status: false, message: e.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const result = await User.find();

      let onlineUsers = await User.find({ isLogin: true }).sort({
        username: 1,
      });
      let offlineUsers = await User.find({ isLogin: false }).sort({
        username: 1,
      });
      const wholeUserList = onlineUsers.concat(offlineUsers);
      const filteredUserList = wholeUserList.map((user) => {
        const { username: name, isLogin } = user;
        return { username: name, isLogin };
      });
      console.log(filteredUserList);
      res.status(200).json(filteredUserList);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = loginLogoutController;
