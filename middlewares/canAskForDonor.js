const canAskForDonor = async (req, res, next) => {
  console.log(
    "req.cookies",
    req.cookies,
    req.cookies.lastStatusCode,
    req.cookies.lastStatusCode != "EMERGENCY"
  );
  /* istanbul ignore next */
  if (req.cookies.lastStatusCode.includes("EMERGENCY")) next();
  else {
    res.redirect("/directory");
  }
};

module.exports = canAskForDonor;
