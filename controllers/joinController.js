require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../models/user");

class JoinController {
  static async join(req, res) {
    try {
      const { username, password } = req.body;
      const io = req.app.get("socketio");
      const existedUser = await User.findOne({
        username: username.toLowerCase(),
      });
      if (existedUser) {
        res.status(405).json({
          error: "user has already exists",
        });
        return;
      }

      const newUser = await User.create({
        username: username.toLowerCase(),
        password,
      });
      const token = jwt.sign(
        {
          id: String(newUser._id),
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "24h" }
      );

      await User.updateOne(
        { username: req.params.username },
        { isLogin: true }
      );
      // user signup successfully, update the userlist and send it to front-end

      const onlineUsers = await User.find({ isLogin: true }).sort({
        username: 1,
      });
      const offlineUsers = await User.find({ isLogin: false }).sort({
        username: 1,
      });
      const wholeUserList = onlineUsers.concat(offlineUsers);
      const filteredUserList = wholeUserList.map((user) => {
        const { username: name, isLogin } = user;
        return { username: name, isLogin };
      });
      console.log(filteredUserList);

      io.emit("userList", filteredUserList);
      res.cookie("jwtToken", token);
      res.cookie("username", username);
      res.location("/welcome");
      res.status(201).json({
        jwtToken: token,
      });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error });
    }
  }

  static async acknowledge(req, res) {
    console.log("enter acknowledgement");
    try {
      // eslint-disable-next-line max-len
      const acknowledge = await User.updateOne(
        { username: req.params.username },
        { isAcknowledge: true }
      );
      console.log("acknowlege", acknowledge);
      res.location("/directory");
      res.status(200).json();
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = JoinController;
