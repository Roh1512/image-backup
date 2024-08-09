const express = require("express");
const router = express.Router();

const filesController = require("../controllers/filesController");

router.get("/", filesController.getAllFiles);
router.post("/addnew", filesController.createFile);
router.get("/:fileid", filesController.getFileById);
router.delete("/:fileid", filesController.deleteFile);

module.exports = router;
