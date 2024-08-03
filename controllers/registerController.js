const bcrypt = require("bcryptjs");
const prisma = require("../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const handleNewUser = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username Must not be Empty.")
    .escape(),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Email must be in the format abcd@something.com")
    .escape(),
  asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both the Username and Password." });
    }

    try {
      const duplicate = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      process.env.NODE_ENV === "development" &&
        console.log("Duplicate: ", duplicate);
      if (duplicate) {
        return res.status(400).json({ message: "Username already exists." });
      }
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.PW_HASH)
      );
      const newUser = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword,
        },
      });
      res.status(201).json({
        message: "User registered successfully",
        user: newUser.username,
      });
    } catch (error) {
      process.env.NODE_ENV === "development" && console.error(error);
      res.status(500).json({ message: "Error registering user" });
    }
  }),
];

module.exports = { handleNewUser };
