import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/privateroute", verifyUser, async (req, res, next) => {
  try {
    return res.status(200).json({ message: "Connected to server securely" });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

export default router;
