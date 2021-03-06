require("dotenv").config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const index = require("./routes/index");
const app = express();

// view engine setup
app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.disable("x-powered-by");
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// establish database connection
mongoose.set("useCreateIndex", true);
mongoose.set("autoIndex", false);
/* istanbul ignore next */
// if (process.env.ENVIRONMENT === "DEV") {
//   mongoose.connect(process.env.DEV_DATABASE);
// } else {
/* istanbul ignore next */
mongoose.connect(process.env.DATABASE);
// }
app.use("/", index);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  /* istanbul ignore next */
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    error: {
      message: "Not Found",
      code: 404,
    },
  });
  next();
});

module.exports = app;
