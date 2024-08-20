// config/corsOptions.js

const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      !origin /*Remove in production */
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE"],
};

module.exports = corsOptions;
