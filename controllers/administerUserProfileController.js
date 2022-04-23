require("dotenv").config();
const jwt = require("jsonwebtoken");
const socket = require("../socket");
const User = require("../models/user");
class administerUserProfileController {
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
      const message = { inform:"your account status has been inactive"};
      io.emit("inactive", message);
      console.log("accountStatus", accountStatus);
      res.status(200).json();
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  static async ChangeToActive(req, res) {
    try {
      console.log("ChangeToActive");
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
      const params = req.params;
      const username = params.username;
      console.log("username", username);
      console.log("body", req.body);
      const modifiedUsername = req.body.username;
      console.log("modifiedUsername", modifiedUsername);
      const modifiedPassword = req.body.password;
      console.log("modifiedPassword", modifiedPassword);
      const modifiedPrivilege = req.body.privilege;

      if (modifiedUsername != null) {
        console.log("enter modifiedUsername");
        await User.updateOne(
          { username: username },
          { username: modifiedUsername }
        );
      }
      if (modifiedPassword != null) {
        console.log("enter modifiedPassword ");
        await User.updateOne(
          { username: username },
          { password: modifiedPassword }
        );
      }
      if (modifiedPrivilege != null) {
        await User.updateOne(
          { username: username },
          { privilege: modifiedPrivilege }
        );
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

module.exports = administerUserProfileController;
