
const suspend = async (req, res, next) => {
  /* istanbul ignore next */
  if (req.app.locals.inTest)
    res.status(503).send("The website is under maintenance");
  else {
    next();
  }
};

module.exports = suspend;
