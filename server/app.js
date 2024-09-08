import dotenv from "dotenv";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import compression from "compression";
import { rateLimit } from "express-rate-limit";

import indexRouter from "./routes/indexRoute.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import filesRoutes from "./routes/filesRoutes.js";

// Load environment variables
dotenv.config();

console.log(process.env.NODE_ENV);
const __dirname = path.resolve();

const app = express();

app.use(express.static(path.resolve(__dirname, "client", "dist")));

// Rate limiter: maximum of fifty requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 500,
});
app.use(limiter);

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

app.use((req, res, next) => {
  if (req.user) {
    const { password, ...sanitizedUser } = req.user._doc || req.user; // Use _doc for Mongoose models
    res.locals.user = sanitizedUser;
  }

  next();
});

app.use("/api", indexRouter);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/files", filesRoutes);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error.";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

export default app;
