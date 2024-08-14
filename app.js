require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const corsOptions = require("./config/corsOptions");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/authRoutes");
const filesRouter = require("./routes/files");
const credentials = require("./middleware/credentials");
const verifyUser = require("./middleware/verifyUser");
const compression = require("compression");

const app = express();

// Rate limiter: maximum of fifty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200,
});
app.use(limiter);

// Apply credentials middleware before CORS
app.use(credentials);

// Apply CORS middleware early
app.use(cors(corsOptions));

// Add handler for OPTIONS requests
app.options("*", cors(corsOptions));

// Helmet configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {},
  })
);

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setTimeout(1000000, () => {
    console.log("Request has timed out.");
    res.send(408);
  });
  next();
});

app.use("/", indexRouter);
app.use("/auth", authRouter);

// Apply user verification middleware
app.use(verifyUser);
app.use("/users", usersRouter);
app.use("/files", filesRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json({ message: "An Error occured" });
});

module.exports = app;
