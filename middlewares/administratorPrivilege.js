const User = require("../models/user");
const administratorPrivilege = (req, res, next) => {
  const username = req.cookies.username;
  const user = User.findOne({ username: username });
  /* istanbul ignore next */
  if (user.privilege === "administrator") {
    next();
  } else res.status(401).render("needToBeAdmin", { title: "needToBeAdmin" });
};
module.exports = administratorPrivilege;
