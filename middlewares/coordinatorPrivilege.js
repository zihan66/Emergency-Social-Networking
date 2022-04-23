const User = require("../models/user");
const coordinatorPrivilege = (req, res, next) =>{
  const username = req.cookies.username;
  const user = User.findOne({username: username});
  if(user.privilege === "administrator" || user.privilege === "coordinator"){
      next();
  }else{
      res.status(401).send("You do not have permission to do this operation");   
  }
}
module.exports = coordinatorPrivilege;