const prisma = require("../config/prismaClient");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = await req.cookies;
  console.log("Cookies at refreshRequest: ", cookies);

  if (!cookies) {
    console.log("No refresh cookie available");
    return res.status(401).json({ message: "No refresh cookie available" });
  }

  const refreshToken = cookies.jwt;
  console.log("Received refresh token: ", refreshToken);

  /* res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    path:"/"
    secure: process.env.NODE_ENV === "production",
  }); */

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        refreshToken: {
          has: refreshToken,
        },
      },
    });

    process.env.NODE_ENV === "development" &&
      console.log("User with the RT: ", foundUser);

    if (foundUser === null) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            console.log("Error decoding refresh token : ", err);
            return res.sendStatus(403);
          }
          console.log("Attempted Refresh Token Reuse");
          const hackedUser = await prisma.user.update({
            where: {
              username: decoded.username,
            },
            data: {
              refreshToken: [],
            },
          });
          console.log(hackedUser);
        }
      );
      console.log("Unauthorized - Refresh Token Reuse");
      return res.sendStatus(403);
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log("Expired Refresh Token: ");
          await prisma.user.update({
            where: { id: foundUser.id },
            data: { refreshToken: newRefreshTokenArray },
          });
          return res.sendStatus(403);
        }
        if (foundUser.username !== decoded.username) {
          process.env.NODE_ENV === "development" &&
            console.log("RT does not match");
          return res.sendStatus(403);
        }

        // Issue new tokens
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: foundUser.username,
              id: foundUser.id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "60m" }
        );
        const newRefreshToken = jwt.sign(
          {
            username: foundUser.username,
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        await prisma.user.update({
          where: { id: foundUser.id },
          data: { refreshToken: [...newRefreshTokenArray, newRefreshToken] },
        });

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          sameSite: "None",
          path: "/",
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.error("Error handling refresh token:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  handleRefreshToken,
};
