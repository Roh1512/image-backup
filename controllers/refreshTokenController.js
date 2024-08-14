const prisma = require("../config/prismaClient");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  process.env.NODE_ENV === "development" &&
    console.log("Cookies at refreshRequest: ", cookies);

  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        refreshToken: {
          has: refreshToken,
        },
      },
    });

    //Detected refresh token reuse
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            return res.sendStatus(403);
          }
          process.env.NODE_ENV === "development" &&
            console.log("Attempted Refresh Token Reuse");
          const hackedUser = await prisma.user.update({
            where: {
              username: decoded.username,
            },
            data: {
              refreshToken: [],
            },
          });
          process.env.NODE_ENV === "development" && console.log(hackedUser);
        }
      );
      return res.sendStatus(403); //Unauthrorized
    }
    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    //Evaluate JWT
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          process.env.NODE_ENV === "development" &&
            console.log("Expired Refresh Token: ");
          await prisma.user.update({
            where: { id: foundUser.id },
            data: { refreshToken: newRefreshTokenArray },
          });
          return res.sendStatus(403);
        }
        if (foundUser.username !== decoded.username) {
          return res.sendStatus(403);
        }

        //Refresh token is still valid
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
        // Update user with the new refresh token
        await prisma.user.update({
          where: { id: foundUser.id },
          data: { refreshToken: [...newRefreshTokenArray, newRefreshToken] },
        });

        // Set the new refresh token as a cookie
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production" ? true : false,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({ accessToken: accessToken });
      }
    );
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error handling refresh token:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  handleRefreshToken,
};
