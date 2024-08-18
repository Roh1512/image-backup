// config/corsOptions.js

const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 204,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

module.exports = corsOptions;
