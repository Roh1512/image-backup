const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  console.log("Origin:", origin); // Add logging
  if (allowedOrigins.includes(origin)) {
    /* console.log("Request headers: ", req.headers);
    console.log("Response headers: ", res.headers); */

    res.header("Access-Control-Allow-Credentials", true);
    process.env.NODE_ENV === "development" &&
      console.log("Access-Control-Allow-Credentials header set."); // Add logging
  }
  next();
};

module.exports = credentials;
