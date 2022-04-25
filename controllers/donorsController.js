require("dotenv").config();
const User = require("../models/user");
const socket = require("../socket");

class donorsController {
  static async updateUserByDonor(req, res) {
    const io = socket.getInstance();
    try {
      let body = {
        isDonor: req.body.isDonor,
      };
      if (req.body.isDonor) body.bloodType = req.body.bloodType;

      const userDonor = await User.updateOne(
        { username: req.params.username },
        body
      );

      let userList = await User.find({ isDonor: true });

      io.emit("donorList", userList);

      res.status(200).json({});
    } catch (error) {}
  }

  static async updateBloodType(req, res) {
    const io = socket.getInstance();
    try {
      let body = {
        bloodType: req.body.bloodType,
      };
      const userDonor = await User.updateOne(
        { username: req.params.username },
        body
      );

      let userList = await User.find({ isDonor: true });
      io.emit("donorList", userList);

      res.status(200).json({});
    } catch (error) {}
  }
  static async getDonors(req, res) {
    try {
      const userDonors = await User.find({ isDonor: true });
      res.status(200).json({ userDonors });
    } catch (error) {}
  }
}
module.exports = donorsController; //donorsController
