const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    res.status(201).json({ message: "Connected to server" });
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to server" });
  }
});

module.exports = router;
