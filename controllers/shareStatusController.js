require("dotenv").config();
const moment = require("moment");
const User = require("../models/user");
const Status = require("../models/status");
const socket = require("../socket");
class shareStatusController {
  static async getOneUserRecord(req, res) {
    try {
      const user =
        (await User.findOne({ username: req.params.username })) || {};
      sensitive;
      const userPassword = user.password;
      const userIsAcknowledge = user.isAcknowledge;
      // non-sensitive
      const userIsLogin = user.isLogin;
      const userLastStatus = user.lastStatusCode;
      const userUsername = user.username;
      const privilege = user.privilege;
      const accountStatus = user.accountStatus;
      const userInformationList = {
        userUsername,
        userIsLogin,
        userLastStatus,
        privilege,
        accountStatus,
      };
      console.log(userInformationList);
      res.status(200).json(userInformationList);
    } catch (error) {
      console.log(error);
    }
  }

  static async setStatus(req, res) {
    const user = req.params;
    const io = socket.getInstance();
    try {
      let result = await User.findOne({ username: user.username });
      await User.updateOne(
        { username: user.username },
        { lastStatusCode: user.lastStatusCode }
      );
      const statusChange = {
        username: user.username,
        statusCode: user.lastStatusCode,
        updatedAt: moment().format(),
      };

      const input_user = user;

      io.emit("updateStatus", input_user);

      await Status.create(statusChange);
      res.status(200).json({});
    } catch (e) {
      res.status(200).send({ status: false, message: e.message });
    }
  }
}
module.exports = shareStatusController; //shareStatus
