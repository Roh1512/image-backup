import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import prisma from "../config/prismaClient.js";

const verifyUser = async (req, res, next) => {
  const token = req.cookies.at;
  process.env.NODE_ENV === "development" && console.log("REQ.USER1", req.user);
  if (!token) {
    return next(errorHandler(401, "Unauthorized user."));
  }
  process.env.NODE_ENV === "development" && console.log(token);
  const foundUser = await prisma.user.findFirst({
    where: {
      tokens: {
        has: token,
      },
    },
  });
  process.env.NODE_ENV === "development" &&
    console.log("Found user with token: ", foundUser);
  if (!foundUser) {
    return next(errorHandler(401, "User with token not found"));
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, "Invalid token"));
    }
    req.user = user;
    next();
  });
};

export { verifyUser };
