import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import {
  getProfileDetails,
  editProfile,
  changePassword,
  deleteAccount,
  editProfilePicture,
} from "../controllers/profileController.js";

const router = express.Router();
router.get("/", verifyUser, getProfileDetails);
router.put("/editprofile", verifyUser, editProfile);
router.put("/profileimagechange", verifyUser, editProfilePicture);
router.put("/pwchange", verifyUser, changePassword);
router.delete("/delete", verifyUser, deleteAccount);

export default router;
