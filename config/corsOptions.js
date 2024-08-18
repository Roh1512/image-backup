// config/corsOptions.js

const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1) {
      // Allow Postman or no origin
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  optionsSuccessStatus: 204,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

module.exports = corsOptions;
