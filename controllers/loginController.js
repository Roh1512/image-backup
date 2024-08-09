const prisma = require("../config/prismaClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const handleLogin = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username must not be empty")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty")
    .escape(),
  asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    process.env.NODE_ENV === "development" &&
      console.log("Cookie avalable at login:\n", JSON.stringify(cookies));
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const foundUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!foundUser) {
      process.env.NODE_ENV === "development" && console.log("User not found");
      return res.status(401).json({ message: "Username does not exists" }); //Unauthorized
    }
    const match = await bcrypt.compare(password, foundUser.password);

    process.env.NODE_ENV === "development" && console.log("Match:", match);

    if (match) {
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            id: foundUser.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      const newRefreshToken = jwt.sign(
        {
          username: foundUser.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      let newRefreshTokenArray = !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        const foundToken = await prisma.user.findFirst({
          where: {
            refreshToken: {
              has: refreshToken,
            },
          },
        });

        //Detected refresh token reuse
        if (!foundToken) {
          process.env.NODE_ENV === "development" &&
            console.log("Attempted refresh token reuse at login.");
          //Clear out All previous refresh tokens
          newRefreshTokenArray = [];
        }
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production" ? true : false,
        });
      }

      const updatingUser = await prisma.user.update({
        where: {
          id: foundUser.id,
        },
        data: {
          refreshToken: [...newRefreshTokenArray, newRefreshToken],
        },
      });
      process.env.NODE_ENV === "development" && console.log(updatingUser);
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production" ? true : false,
        maxAge: 24 * 60 * 60 * 1000,
      });
      process.env.NODE_ENV === "development" && console.log(accessToken);

      res.json({ accessToken });
    } else {
      res.status(401).json({ message: "Incorrect Password" });
    }
  }),
];
module.exports = { handleLogin };
