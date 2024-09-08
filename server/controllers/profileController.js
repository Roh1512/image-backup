import prisma from "../config/prismaClient.js";
import { errorHandler } from "../utils/errorHandler.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { body, validationResult } from "express-validator";
import bcryptjs from "bcryptjs";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getProfileDetails = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const userDetails = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        files: true,
      },
    });
    const { password, tokens, ...userDetailsRest } = userDetails;
    res.status(200).json(userDetailsRest);
  } catch (error) {
    next(error);
  }
};

export const editProfile = [
  body("username").trim().escape(),
  body("email").trim().escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errorHandler(400, errors.array()[0].msg));
    }
    const userId = req.user.id;
    try {
      const currentUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      const match = bcryptjs.compareSync(
        req.body.password,
        currentUser.password
      );
      if (!match) {
        return next(
          errorHandler(401, "Incorrect password. Cannot edit profile.")
        );
      }
      const username = req.body.username || currentUser.user;
      const email = req.body.email || currentUser.email;
      const duplicateUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: username }, { email: email }],
          NOT: {
            id: userId,
          },
        },
      });

      process.env.NODE_ENV === "development" &&
        console.log(
          "Checking for duplicate user with username:",
          username,
          "and email:",
          email
        );

      if (duplicateUser) {
        process.env.NODE_ENV === "development" &&
          console.log("Duplicate user: ", duplicateUser);
        return next(errorHandler(400, "Username or email already exists."));
      }
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          username,
          email,
          updatedAt: new Date(),
        },
      });
      const { password, tokens, ...rest } = updatedUser;
      return res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  },
];

export const changePassword = [
  body("currentPassword")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty."),
  body("newPassword")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty."),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errorHandler(400, errors.array()[0].msg));
    }
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      const currentUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!currentUser) {
        return next(errorHandler(404, "User not found"));
      }
      const currentPasswordCheck = bcryptjs.compareSync(
        currentPassword,
        currentUser.password
      );
      if (!currentPasswordCheck) {
        return next(errorHandler(401, "Password is incorrect."));
      }
      const newHashedPassword = bcryptjs.hashSync(
        newPassword,
        parseInt(process.env.PW_HASH)
      );
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { password: newHashedPassword, updatedAt: new Date() },
      });
      const { password: hashedPw, tokens, ...sanitizedUser } = updatedUser;
      res.clearCookie("at", {
        httpOnly: true,
        secure: process.env.NODE_ENV === production,
      });
      return res
        .status(200)
        .json({ message: "Password updated.", user: sanitizedUser });
    } catch (error) {
      next(error);
    }
  },
];

export const editProfilePicture = [
  upload.single("profileImage"),
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      return next(errorHandler(401, "Unauthorized"));
    }
    try {
      if (!req.file) {
        return next(errorHandler(400, "No image uploaded"));
      }
      const imageMimeTypeRegex = /^image\/(jpeg|png|gif|webp|svg\+xml|tiff)$/;
      if (!imageMimeTypeRegex.test(req.file.mimetype)) {
        return next(
          errorHandler(400, "Invalid file type. Only image files are allowed.")
        );
      }

      // Fetch the current user and check for an existing profile image
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!currentUser) {
        return next(errorHandler(404, "User not found"));
      }
      if (currentUser.profileImagePublicId) {
        try {
          await cloudinary.uploader.destroy(currentUser.profileImagePublicId);
        } catch (error) {
          process.env.NODE_ENV === "development" &&
            console.log("Error deleting old profile picture from Cloudinary");
          return next(errorHandler(500, "Failed to delete old profile image"));
        }
      }
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          public_id: `${userId}/profileImage_${Date.now()}`,
          folder: "imageBackup",
        },
        async (error, result) => {
          if (error) {
            process.env.NODE_ENV === "development" &&
              console.log("Error uploading new profile image to Cloudinary");
            return next(errorHandler(500, "Failed to upload profile image"));
          }
          try {
            const updatedUser = await prisma.user.update({
              where: {
                id: userId,
              },
              data: {
                profileImagePublicId: result.public_id,
                imageUrl: result.secure_url,
                updatedAt: new Date(),
              },
            });
            const { password, tokens, ...rest } = updatedUser;
            return res.status(200).json(rest);
          } catch (error) {
            process.env.NODE_ENV === "development" &&
              console.log("Error updating profile image in database");
            return next(
              errorHandler(500, "Error saving new profile image in database")
            );
          }
        }
      );
      // Write the buffer to the stream
      stream.end(req.file.buffer);
    } catch (error) {
      next(error);
    }
  },
];

export const deleteAccount = [
  body("password").trim().isLength({ min: 1 }).withMessage("Enter password"),
  async (req, res, next) => {
    const userId = req.user.id;
    if (!userId) {
      return next(errorHandler(401, "Not authorized to delete account"));
    }
    const error = validationResult(req);
    if (!error.isEmpty) {
      return next(errorHandler(400, error.array()[0].msg));
    }
    try {
      const userFound = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          files: true,
        },
      });
      if (!userFound) {
        return next(errorHandler(404, "User not found"));
      }

      const validPassword = bcryptjs.compareSync(
        req.body.password,
        userFound.password
      );

      if (!validPassword) {
        return next(errorHandler(401, "Incorrect password"));
      }

      //Delete files from cloudinary
      try {
        const deletePromises = userFound.files.map(async (file) => {
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
        process.env.NODE_ENV === "development" &&
          console.log("Error deleting files: ", error);

        return next(errorHandler(500, "Error deleting files from cloudinary"));
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
      res.clearCookie("at", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(200).json({ message: "User account deleted" });
    } catch (error) {
      next(error);
    }
  },
];
