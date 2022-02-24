const express = require("express");

const router = express.Router();
console.log(1);
/* GET signup page. */
router.get("/", (req, res) => {
  res.render("signUp", { title: "Express" });
});

module.exports = router;
