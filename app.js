require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/authRoutes");
const filesRouter = require("./routes/files");
const verifyUser = require("./middleware/verifyUser");
const compression = require("compression");

const app = express();

app.use(express.static(path.join(__dirname, "/client/dist")));

app.set("trust proxy", 1);

// Rate limiter: maximum of fifty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000,
});
app.use(limiter);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
      imgSrc: [
        "'self'", // Allow images from the same origin
        "https://res.cloudinary.com", // Allow images from Cloudinary
        "data:", // Allow data URIs for images
      ],
    },
  })
);

app.use(logger("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: false }));
app.use(cookieParser());
app.use(compression());

app.use((req, res, next) => {
  res.setTimeout(1000000, () => {
    console.log("Request has timed out.");
    res.send(408);
  });
  next();
});

app.use("/api", indexRouter);
app.use("/api/auth", authRouter);

// Apply user verification middleware
app.use(verifyUser);
app.use("/api/users", usersRouter);
app.use("/api/files", filesRouter);

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

module.exports = app;
