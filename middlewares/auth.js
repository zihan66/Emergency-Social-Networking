const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  let token = String(req.headers.authorization).split(" ").pop();
  if (token === "undefined") {
    token = req.cookies.jwtToken;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
    if (err) {
      res.status(401).json({
        error: "token does not exist or has expired",
      });
      // eslint-disable-next-line no-empty
    } else {
      next();
    }
  });
};

module.exports = auth;
