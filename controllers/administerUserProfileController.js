require("dotenv").config();
const socket = require("../socket");
const User = require("../models/user");
const Message = require("../models/message").Message;

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
      if (myPrivilege == "Administrator" || myPrivilege == "administrator") {
        res.render("changeProfile", {
          userInformationList: userInformationList,
        });
      } else {
        res.render("needToBeAdmin", { title: "needToBeAdmin" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async ChangeToInactive(req, res) {
    try {
      console.log("ChangeToinactive");
      const io = socket.getInstance();
      const allAdministrator = await User.count({
        privilege: "administrator",
      });
      const params = req.params;
      const username = params.username;
      const user = await User.findOne({ username: username });

      if (user.privilege === "administrator" && allAdministrator <= 1) {
        res.status(400).json({ error: "at least one administrator" });
        return;
      }
      const accountStatus = await User.updateOne(
        { username: username },
        { accountStatus: "inactive" }
      );
      socket.sendLogOutEvent(
        username,
        "The information of your account has been updated"
      );
      const userList = await User.findAllUsers();
      const userListWithInactive = await User.findAllUsersForAdmin();
      io.emit("userList", userList);
      io.emit("userListForAdmin", userListWithInactive);
      const usersActive = await User.find({ accountStatus: "active" });
      const filteredUserList = usersActive.map((user) => {
        return user.username;
      });
      const activePublicMessage = await Message.find({
        author: { $in: filteredUserList },
        type: "public",
      });
      const activeAnnouncement = await Message.find({
        author: { $in: filteredUserList },
        type: "announcement",
      });
      io.emit("publicMessageUpdate", activePublicMessage);
      io.emit("announcementUpdate", activeAnnouncement);
      res.status(204).json();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }

  static async ChangeToActive(req, res) {
    try {
      const io = socket.getInstance();
      const params = req.params;
      const username = params.username;
      console.log("ChangeToActive,username: ", username);
      const accountStatus = await User.updateOne(
        { username: username },
        { accountStatus: "active" }
      );
      const userList = await User.findAllUsers();
      const userListWithInactive = await User.findAllUsersForAdmin();
      io.emit("userList", userList);
      io.emit("userListForAdmin", userListWithInactive);
      const usersActive = await User.find({ accountStatus: "active" });
      const filteredUserList = usersActive.map((user) => {
        return user.username;
      });
      const activePublicMessage = await Message.find({
        author: { $in: filteredUserList },
        type: "public",
      });
      const activeAnnouncement = await Message.find({
        author: { $in: filteredUserList },
        type: "announcement",
      });
      io.emit("publicMessageUpdate", activePublicMessage);
      io.emit("announcementUpdate", activeAnnouncement);
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
      const io = socket.getInstance();
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
      socket.sendLogOutEvent(username, "Your account status has changed!");
      const userList = await User.findAllUsers();
      const userListWithInactive = await User.findAllUsersForAdmin();
      io.emit("userList", userList);
      io.emit("userListForAdmin", userListWithInactive);
      res.status(204).json();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
}

module.exports = administerUserProfileController;
