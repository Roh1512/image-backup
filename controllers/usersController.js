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
    const { username, email, currentPassword } = req.body;
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const currentPasswordCheck = await bcrypt.compare(
      currentPassword,
      currentUser.password
    );
    if (currentPasswordCheck) {
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
          data: { username, email },
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
    } else {
      return res
        .status(400)
        .json({ message: "You have entered the wrong password" });
    }
  }),
];

exports.changePassword = [
  body("currentPassword")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Current password should not be empty")
    .escape(),
  body("newPassword")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Current password should not be empty")
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    const userId = req.user?.id;
    if (!userId) {
      return res.status(500).json({ message: "Unauthorized" });
    }
    const { currentPassword, newPassword } = req.body;
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!currentUser) {
      return res.status(500).json("User not found.");
    }
    const currentPasswordCheck = await bcrypt.compare(
      currentPassword,
      currentUser.password
    );
    if (currentPasswordCheck) {
      try {
        const newPasswordHashed = await bcrypt.hash(
          newPassword,
          parseInt(process.env.PW_HASH)
        );
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { password: newPasswordHashed },
        });
        process.env.NODE_ENV === "development" && console.log(updatedUser);
        return res
          .status(201)
          .json({ message: "Password Changed successfully." });
      } catch (error) {
        console.error("Error changing password", error);
        return res
          .status(500)
          .json({ message: "An error occurred while changing password." });
      }
    } else {
      res.status(400).json({ message: "Current password is incorrect." });
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

    // Delete all files from Cloudinary
    try {
      const deletePromises = userfound.files.map(async (file) => {
        // Determine the resource type (image or video)
        const resourceType = file.type === "VIDEO" ? "video" : "image";

        // Delete the file from Cloudinary with the correct resource type
        await cloudinary.uploader.destroy(file.public_id, {
          resource_type: resourceType,
        });
        process.env.NODE_ENV === "development" &&
          console.log(`Deleted ${file.type.toLowerCase()} from Cloudinary`);
      });

      // Wait for all delete operations to complete
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting files from Cloudinary:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while deleting files." });
    }

    // Delete all file records associated with the user in the database
    await prisma.file.deleteMany({
      where: { userId: userId },
    });

    // Delete the user's account from the database
    await prisma.user.delete({
      where: { id: userId },
    });

    // Clear the user's cookies and send a success response
    res.clearCookie("jwt"); /* Also clear access token on client */
    res.status(201).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account and files:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the account." });
  }
});
