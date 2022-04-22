
const suspend = async (req, res, next) => {
  if (req.app.locals.inTest)
    res.status(503).send("The website is under maintenance");
  else {
    next();
  }
};
// const User = require("../models/user");
// const privilege = (req, res, next) =>{
//   const username = req.paras.username;
//   const user = User.findOne({username: username});
//   if(user.privilege === "citizen"){

//   }
// }
module.exports = suspend;
