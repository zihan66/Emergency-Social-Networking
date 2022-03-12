require("dotenv").config();
const brypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

class accessUserInformationController {
  static async getOneUserRecord(req, res) {
    try {
      const user = await User.findOne({ username: req.params.username });
      // sensitive
      const userPassword = user.password;
      const userIsAcknowledge = user.isAcknowledge;
      // non-sensitive
      const userIsLogin = user.isLogin;
      const userLastStatus = user.lastStatusCode;
      const userUsername = user.username;
      // const userLastUpdateTime = user.lastStatusUpdateTime;
      // merge into a list
      const userInformationList = {userUsername, userIsLogin, userLastStatus, userLastUpdateTime};
      console.log(userInformationList);
      res.status(200).json(userInformationList);
    } catch (error) {
      console.log(error);
    }
  }

  // static async setStatus(req, res) {
  //   const user = req.params;
  //   // const io = req.app.get("socketio");
  //   console.log("setRed user ", user);
  //   try {
  //     let result = await User.findOne({ username: user.username });
  //     if (result) {
  //       if (user.lastStatusCode === "red"){
  //         await User.updateOne({ username: user.username }, { lastStatusCode: "red"  });
  //       }
  //       else if (user.lastStatusCode === "green"){
  //         await User.updateOne({ username: user.username }, { lastStatusCode: "green" });
  //       }
  //       else if (user.lastStatusCode === "yellow"){
  //         await User.updateOne({ username: user.username }, { lastStatusCode: "yellow" });
  //       }
  //       else if (user.lastStatusCode === "grey"){
  //         await User.updateOne({ username: user.username }, { lastStatusCode: "grey" });
  //       }
  //       res.status(200).json({});
  //     }
  //   } catch (e) {
  //     res.status(200).send({ status: false, message: e.message });
  //   }
  // }

}
module.exports = accessUserInformationController;