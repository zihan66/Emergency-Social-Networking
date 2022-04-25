const User = require("../models/user");
const administratorPrivilege = (req, res, next) => {
  const username = req.cookies.username;
  const user = await User.findOne({ username: username });
  if (user.privilege === "administrator") {
    next();
  } else res.status(401).render("needToBeAdmin", { title: "needToBeAdmin" });
};
module.exports = administratorPrivilege;
