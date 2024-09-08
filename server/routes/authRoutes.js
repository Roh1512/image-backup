import express from "express";
import { signUp, login, logout } from "../controllers/authController.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/private", verifyUser, (req, res, next) => {
  try {
    return res.status(200).json({ message: "Private route" });
  } catch (error) {
    next(error);
  }
});

export default router;
