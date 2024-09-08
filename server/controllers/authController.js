import prisma from "../config/prismaClient.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

export const signUp = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username must not be empty")
    .escape(),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Email must be in the format abcd@something.com")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty"),
  async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
      return next(
        errorHandler(
          400,
          "Please provide username,email and password to continue"
        )
      );
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errorHandler(400, errors.array()[0].msg));
    }
    try {
      const [duplicateUsername, duplicateEmail] = await Promise.all([
        prisma.user.findUnique({
          where: {
            username: username,
          },
        }),
        prisma.user.findUnique({
          where: {
            email: email,
          },
        }),
      ]);
      process.env.NODE_ENV === "development" &&
        console.log("Duplicate: ", duplicateUsername || duplicateEmail);
      if (duplicateUsername) {
        return next(errorHandler(400, "Username already exists"));
      }
      if (duplicateEmail) {
        return next(errorHandler(400, "Email already exists."));
      }
      const hashedPassword = bcryptjs.hashSync(
        password,
        parseInt(process.env.PW_HASH)
      );
      const newUser = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          email: email,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const token = jwt.sign(
        {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "24h",
        }
      );

      const updateUserTokenArray = await prisma.user.update({
        where: {
          id: newUser.id,
        },
        data: {
          tokens: {
            push: token,
          },
        },
      });

      const {
        password: hashedPW,
        tokens,
        ...sanitizedUser
      } = updateUserTokenArray;

      console.log(updateUserTokenArray);
      const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      res
        .cookie("at", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expires: expiryDate,
        })
        .status(200)
        .json(sanitizedUser);
    } catch (error) {
      next(error);
    }
  },
];

export const login = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username must not be empty")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty"),
  async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(errorHandler(400, "Enter username and password to login"));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errorHandler(400, errors.array()[0].msg));
    }
    try {
      const validUser = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });
      if (!validUser) {
        return next(errorHandler(400, "Username does not exists."));
      }
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
        return next(errorHandler(401, "Wrong credentials"));
      }
      const token = jwt.sign(
        {
          id: validUser.id,
          username: validUser.username,
          email: validUser.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "24h",
        }
      );
      const updateUserTokenArray = await prisma.user.update({
        where: {
          id: validUser.id,
        },
        data: {
          tokens: {
            push: token,
          },
        },
      });
      console.log(updateUserTokenArray);
      const {
        password: hashedPW,
        tokens,
        ...sanitizedUser
      } = updateUserTokenArray;
      const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      res
        .cookie("at", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expires: expiryDate,
        })
        .status(200)
        .json(sanitizedUser);
    } catch (error) {
      next(error);
    }
  },
];

export const logout = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.at) {
    console.log("No at cookies found");
    return res.status(204).json({ message: "No content found" });
  }
  const token = cookies.at;
  console.log(token);

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        tokens: {
          has: token,
        },
      },
    });
    console.log("Found User: ", foundUser);

    if (!foundUser) {
      return res
        .clearCookie("at", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(204)
        .json({ message: "User not found" });
    }
    const updatedTokenArray = foundUser.tokens.filter(
      (value) => value !== token
    );
    const updatedUser = await prisma.user.update({
      where: {
        id: foundUser.id,
      },
      data: {
        tokens: updatedTokenArray,
      },
    });
    console.log("Updated Tokens: ", updatedUser);

    return res
      .clearCookie("at", {
        httpOnly: true,
        secure: false,
      })
      .status(200)
      .json({ message: "Logout success" });
  } catch (error) {
    next(error);
  }
};
