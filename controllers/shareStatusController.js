require("dotenv").config();
const moment = require("moment");
const brypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Status = require("../models/status");

class shareStatusController {
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
      const userInformationList = { userUsername, userIsLogin, userLastStatus };
      console.log(userInformationList);
      res.status(200).json(userInformationList);
    } catch (error) {
      console.log(error);
    }
  }

  

  static async setStatus(req, res) {
    const user = req.params;
    const io = req.app.get("socketio");
    // const io = req.app.get("socketio");
    // console.log("setStatus user ", user);
    try {
      let result = await User.findOne({ username: user.username });
      
      if (result) {
        console.log(user.username);
        console.log(user.lastStatusCode);
        await User.updateOne(
          { username: user.username },
          { lastStatusCode: user.lastStatusCode }
        );
        //here just use the same emit method userList
        // const userList = await User.findAllUsers();
        // console.log("test: ", userList);
        // io.emit("userList", userList);
        // const updateUser = user.username;
        // const updatedStatus = user.lastStatusCode;
        
        // console.log("updateUser&updatedStatus",updateUser,updatedStatus);
        // io.emit("updateDirectoryProfile", updateUser, updatedStatus);
        const statusChange = {
          username: user.username,
          statusCode: user.lastStatusCode,
          updatedAt: moment().format(),
        };
        console.log("statusChange",statusChange);
        const input_user = user;
        console.log("emit_test user:", input_user);
        
       
        io.emit("updateStatus", input_user);
        
        await Status.create(statusChange);
        console.log("AAaa");
        res.status(200).json({});
      }
      
    } catch (e) {
      res.status(200).send({ status: false, message: e.message });
    }
  }
}
module.exports = shareStatusController; //shareStatus
