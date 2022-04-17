const canBeDonor = async (req, res, next) => {
  console.log("req.cookies", req.cookies);
  if (req.cookies.lastStatusCode.includes("OK"))
    next();
  else {
     res.location("/redirect");
    
  }
};

module.exports = canBeDonor;
