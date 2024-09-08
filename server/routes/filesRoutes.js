import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import {
  getAllFiles,
  getFileById,
  createFile,
  deleteFile,
} from "../controllers/filesController.js";

const router = express.Router();

router.get("/", verifyUser, getAllFiles);
router.post("/add", verifyUser, createFile);
router.get("/:fileid", verifyUser, getFileById);
router.delete("/:fileid", verifyUser, deleteFile);

export default router;
