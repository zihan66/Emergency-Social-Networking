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
      const myPrivilege = req.cookies.privilege
      // const userLastUpdateTime = user.lastStatusUpdateTime;
      // merge into a list
      const userInformationList = { username, password, isLogin, isAcknowledge, lastStatusCode, privilege, accountStatus, myPrivilege};
      console.log(userInformationList);
      // res.status(200).json(userInformationList);
      

      // const myName = req.cookies.username;
      // const me = (await User.findOne({ username: myName })) || {};
      // const myPrivilege = me.privilege;
      if(myPrivilege == "Administrator" || myPrivilege == "administrator"){
        res.render("changeProfile",{userInformationList:userInformationList});
      }
      else{
        // res.render("needToBeAdmin", { title: "needToBeAdmin" });
        res.render("changeProfile",{userInformationList:userInformationList});
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
      if (user.privilege === "administrator" && allAdministrator.length == 1) {
        res.status(500).json({ message: "at least one activeadministrator" });
      }
      const accountStatus = await User.updateOne(
        { username: username },
        { accountStatus: "inactive" }
      );
      console.log("accountStatus", accountStatus);
      res.status(200).json();
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  static async ChangeToActive(req, res) {
    try {
      console.log("ChangeToActive");
      const io = socket.getInstance();
      const params = req.params;
      const username = params.username;
      const accountStatus = await User.updateOne(
        { username: username },
        { accountStatus: "active" }
      );
      console.log("accountStatus", accountStatus);
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  static async updateUserProfile(req, res) {
    try {
      console.log("updateUserProfile!!!");
      const io = socket.getInstance();
      const params = req.params;
      const username = params.username;
      console.log("username", username);
      console.log("body", req.body);

      const modifiedUsername = req.body.username;
      console.log("modifiedUsername", modifiedUsername);
      const modifiedPassword = req.body.password;
      console.log("modifiedPassword", modifiedPassword);
      const modifiedPrivilege = req.body.privilege;
      console.log("modifiedPrivilege", modifiedPrivilege);
      const modifiedAccountStatus = req.body.accountStatus;
      console.log("modifiedAccountStatus", modifiedAccountStatus);

      if (modifiedPassword != null) {
        console.log("enter modifiedPassword ");
        await User.updateOne(
          { username: username },
          { password: modifiedPassword }
        );
      }
      if (modifiedPrivilege != null) {
        console.log("enter modifiedPrivilege ");
        await User.updateOne(
          { username: username },
          { privilege: modifiedPrivilege }
        );
      }
      if (modifiedAccountStatus != null) {
        console.log("enter modifiedAccountStatus ");
        await User.updateOne(
          { username: username },
          { accountStatus: modifiedAccountStatus }
        );
      }
      if (modifiedUsername != null) {
        console.log("enter modifiedUsername");
        await User.updateOne(
          { username: username },
          { username: modifiedUsername }
        );
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

module.exports = administerUserProfileController;
