const express = require("express");
const joinController = require("../controllers/joinController");
const auth = require("../middleware/auth");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "Login" });
});

router.get("/signUp", (req, res) => {
  res.render("signUp", { title: "SignUp" });
});

router.get("/publicWall", (req, res) => {
  res.render("publicWall", { title: "publicWall" });
});

router.get("/welcome", auth, (req, res) => {
  res.render("/welcome");
});

router.post("/users", joinController.join);

// // current user
// const User = mongoose.model("User", userSchema);

// // post user login page, given that the user already exists
// router.post("/login", async (req, res) => {
//   const user = req.body;
//   console.log("req: POST /login", user);
//   try {
//     if (!user.username || !user.password) {
//       res
//         .status(200)
//         .send({ status: "error", message: "username or password is empty" });
//       return;
//     }
//     if (user.username.length < 4) {
//       res.status(200).send({
//         status: "error",
//         message: "username too short, should be at least 4 characters long.",
//       });
//       return;
//     }
//     if (resevedUsernameList.includes(user.username)) {
//       res.status(200).send({
//         status: "error",
//         message: "username is reserved, please choose another one.",
//       });
//       return;
//     }
//     user.username = user.username.toLowerCase();
//     const result = await User.findOne(user);
//     if (result) {
//       jwt.sign(
//         { username: user.username },
//         "secret",
//         { expiresIn: "1h" },
//         (err, token) => {
//           if (err) {
//             res
//               .status(200)
//               .send({ status: "error", message: "internal error" });
//             return;
//           }
//           res.status(200).send({ status: "success", token });
//         }
//       );
//     } else {
//       res
//         .status(200)
//         .send({ status: "error", message: "username or password is wrong" });
//     }
//   } catch (e) {
//     res.status(200).send({ status: "error", message: e.message });
//   }
// });

// post user register page, given that the user is new

// check token
// router.get("/check", (req, res) => {
//   jwt.verify(req.headers.authorization, "secret", (err, decoded) => {
//     if (err) {
//       res.status(200).send({ status: "error", message: "token is invalid" });
//       return;
//     }
//     const expire = decoded.exp - Math.floor(Date.now() / 1000);
//     if (expire < 0) {
//       res.status(200).send({ status: "error", message: "token is expired" });
//       return;
//     }
//     const user = User.findOne({ username: decoded.username });
//     if (user) {
//       res.status(200).send({ status: "success", username: decoded.username });
//     } else {
//       res.status(200).send({ status: "error", message: "token is invalid" });
//     }
//   });
// });

module.exports = router;
