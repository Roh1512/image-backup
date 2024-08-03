const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(201).json({ data: "Secret Data", message: "Private route" });
});

module.exports = router;
