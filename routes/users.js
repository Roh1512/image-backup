const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");

/* GET users listing. */
router.get("/", usersController.getAllUsers);

router.put("/profile/pw", usersController.changePassword);

router.get("/profile", usersController.getUserDetails);

router.put("/profile", usersController.editUserDetails);

router.delete("/profile", usersController.deleteAccount);

module.exports = router;
