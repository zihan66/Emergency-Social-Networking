require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../models/user");

class JoinController {
  static async join(req, res) {
    try {
      const { username, password } = req.body;
      const existedUser = await User.findOne({
        username: username.toLowerCase(),
      });
      if (existedUser) {
        res.status(405).json({
          error: "user has already exists",
        });
        return;
      }

      const newUser = await User.create({
        username: username.toLowerCase(),
        password,
      });
      const token = jwt.sign(
        {
          id: String(newUser._id),
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "24h" }
      );
      res.cookie("jwtToken", token);
      res.location("/welcome");
      res.status(201).json({
        jwtToken: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
}

module.exports = JoinController;
