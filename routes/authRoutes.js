const express = require("express");
const router = express.Router();

const registerController = require("../controllers/registerController");

const loginController = require("../controllers/loginController");

const refreshTokenController = require("../controllers/refreshTokenController");

const logoutController = require("../controllers/logoutController");

router.post("/register", registerController.handleNewUser);

router.post("/login", loginController.handleLogin);

router.get("/logout", logoutController.handleLogout);

router.get("/refresh", refreshTokenController.handleRefreshToken);

module.exports = router;
