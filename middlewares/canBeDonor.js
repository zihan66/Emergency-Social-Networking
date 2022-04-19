const canBeDonor = async (req, res, next) => {
  if (req.cookies.lastStatusCode.includes("OK")) next();
  else {
    res.location("/redirect");
  }
};

module.exports = canBeDonor;
