const prisma = require("../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinaryConfig");

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();
  return res.json(users);
});

exports.getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userDetails = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      files: true,
    },
  });
  res.json(userDetails);
});

exports.editUserDetails = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username must not be empty")
    .escape(),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must not be empty")
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    const userId = req.user?.id;
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.PW_HASH)
    );
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: username }, { email: email }],
          NOT: {
            id: userId, // Ensure the user is not checking their own details
          },
        },
      });
      if (existingUser) {
        // If a user with the given username or email already exists, send an error message
        return res.status(400).json({
          message:
            "Username or email already exists. Please choose a different one.",
        });
      }

      // Proceed with updating the user details if validation passes
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { username, email, password: hashedPassword },
      });

      // Send a success response with the updated user details
      res.status(201).json({
        message: "User details updated successfully.",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user details:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while updating user details." });
    }
  }),
];

exports.deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this account." });
  }

  try {
    // Find the user and their files
    const userfound = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        files: true,
      },
    });

    if (!userfound) {
      return res.status(404).json({ message: "User not found." });
    }
    try {
      userfound.files.map(async (file) => {
        await cloudinary.uploader.destroy(file.public_id);
        process.env.NODE_ENV === "development" &&
          console.log("Deleted all files");
      });
    } catch (error) {
      process.env.NODE_ENV === "development" && console.error(error);
      return error;
    }
    await prisma.file.deleteMany({
      where: {
        userId: userId,
      },
    });
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    res.clearCookie("jwt"); /*Also clear access token on client */
    res.status(201).json({ message: "User account deleted" });
  } catch (error) {
    console.error("Error deleting user account and files:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the account." });
  }
});
