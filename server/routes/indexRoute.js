import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/privateroute", verifyUser, async (req, res, next) => {
  try {
    return res.status(200).json({ message: "Connected to server securely" });
  } catch (error) {
    next(error);
  }
});

export default router;
