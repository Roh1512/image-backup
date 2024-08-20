const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  console.log("Origin:", origin); // Add logging
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
    process.env.NODE_ENV === "development" &&
      console.log("Access-Control-Allow-Credentials header set."); // Add logging
  }
  next();
};

module.exports = credentials;
