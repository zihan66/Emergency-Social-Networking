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
      const userLastUpdateTime = user.lastStatusUpdateTime;
      // merge into a list
      const userInformationList = {userUsername, userIsLogin, userLastStatus, userLastUpdateTime};
      console.log(userInformationList);
      res.status(200).json(userInformationList);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = accessUserInformationController;