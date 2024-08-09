// config/corsOptions.js

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5174",
  "http://localhost:3500",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow Postman or no origin
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

module.exports = corsOptions;
