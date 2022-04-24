require("dotenv").config();
const jwt = require("jsonwebtoken");
const socket = require("../socket");
const User = require("../models/user");

class administerUserProfileController {

  static async renderOneUserRecord(req, res) {
    try {
      const user =
        (await User.findOne({ username: req.params.username })) || {};
      // sensitive
      const password = user.password;
      const isAcknowledge = user.isAcknowledge;
      // non-sensitive
      const isLogin = user.isLogin;
      const lastStatusCode = user.lastStatusCode;
      const username = user.username;
      const privilege = user.privilege;
      const accountStatus = user.accountStatus;
      const myPrivilege = req.cookies.privilege;
      // const userLastUpdateTime = user.lastStatusUpdateTime;
      // merge into a list
      const userInformationList = {
        username,
        password,
        isLogin,
        isAcknowledge,
        lastStatusCode,
        privilege,
        accountStatus,
        myPrivilege,
      };
      console.log(userInformationList);
      // res.status(200).json(userInformationList);
      // const myName = req.cookies.username;
      // const me = (await User.findOne({ username: myName })) || {};
      // const myPrivilege = me.privilege;
      if (myPrivilege == "Administrator" || myPrivilege == "administrator") {
        res.render("changeProfile", {
          userInformationList: userInformationList,
        });
      } else {
        res.render("needToBeAdmin", { title: "needToBeAdmin" });
        // res.render("changeProfile", {
        //   userInformationList: userInformationList,
        // });
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async ChangeToInactive(req, res) {
    try {
      console.log("ChangeToinactive");
      const io = socket.getInstance();
      const allAdministrator = await User.find({ privilege: "administrator" });
      console.log("administrator", allAdministrator.length);
      const params = req.params;
      const username = params.username;
      const user = await User.findOne({ username: username });
      console.log("user", user);
      console.log(username);

      if (user.privilege === "administrator" && allAdministrator.length == 1) {

        res.status(400).json({ error: "at least one active administrator" });
        return;
      }
      const accountStatus = await User.updateOne(
        { username: username },
        { accountStatus: "inactive" }
      );
      socket.sendLogOutEvent(username, "Your account status has changed!");
      console.log("accountStatus", accountStatus);
      res.status(204).json();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }

  static async ChangeToActive(req, res) {
    try {
      console.log("ChangeToActive");
      const params = req.params;
      const username = params.username;
      console.log("ChangeToActive,username: ", username);
      const accountStatus = await User.updateOne(
        { username: username },
        { accountStatus: "active" }
      );
      console.log("accountStatus", accountStatus);
      res.status(204).json();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }

  static async updateUserProfile(req, res) {

    console.log("Profile update start...");

    try {

      const params = req.params;

      const username = params.username;

      const modifiedUsername = req.body.username;

      const modifiedPassword = req.body.password;

      const modifiedPrivilege = req.body.privilege;

      const isExist = await User.findOne({ username: modifiedUsername });
      if (isExist && username !== modifiedUsername) {

        res.status(400).json({ error: "this username has existed" });
        return;
      }

      const allAdministrator = await User.count({
        privilege: "administrator",
      });

      const user = await User.findOne({ username: username });
      console.log(user);

      if (
        user.privilege === "administrator" &&
        allAdministrator <= 1 &&
        modifiedPrivilege !== "administrator"
      ) {

        res.status(400).json({ error: "at least one administrator" });
        return;
      }

      // if (modifiedPassword != null) {
      if (modifiedPassword) {

        await User.updateOne(
          { username: username },
          {
            password: modifiedPassword,
            username: modifiedUsername,
            privilege: modifiedPrivilege,
          }
        );
      } else {
        await User.updateOne(
          { username: username },
          { username: modifiedUsername, privilege: modifiedPrivilege }
        );
      }
      res.status(204).json();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });

    }
  }
}

module.exports = administerUserProfileController;
