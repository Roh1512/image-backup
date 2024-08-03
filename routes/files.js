const express = require("express");
const router = express.Router();

const filesController = require("../controllers/filesController");

router.get("/", filesController.getAllFiles);
router.post("/addnew", filesController.createFile);
router.get("/:id", filesController.getFileById);
router.delete("/:id", filesController.deleteFile);

module.exports = router;
