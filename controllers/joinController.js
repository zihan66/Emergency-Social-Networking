require("dotenv").config();
const jwt = require("jsonwebtoken");
const socket = require("../socket");
const User = require("../models/user");

class JoinController {
  static async join(req, res) {
    try {
      const { username, password } = req.body;
      const io = socket.getInstance();
      const existedUser = await User.findOne({
        username,
      });
      // if (existedUser) {
      //   res.status(405).json({
      //     error: "user has already exists",
      //   });
      //   return;
      // }
      const newUser = await User.create({
        username,
        password,
      });
      const token = jwt.sign(
        {
          id: String(newUser._id),
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "24h" }
      );

      await User.updateOne({ username: req.body.username }, { isLogin: true });
      // user signup successfully, update the userlist and send it to front-end
      const userList = await User.findAllUsers();
      io.emit("userList", userList);
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
