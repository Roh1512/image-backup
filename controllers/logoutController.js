const prisma = require("../config/prismaClient");

const handleLogout = async (req, res) => {
  //On Client Also delete the access Token//
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    process.env.NODE_ENV === "development" && console.log("No Cookies found");
    return res.sendStatus(204); //Content not found
  }

  const refreshToken = cookies.jwt;

  //Is refreshToken in DB
  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        refreshToken: {
          has: refreshToken,
        },
      },
    });

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      });
      process.env.NODE_ENV === "development" && console.log("No user found.");
      return res.status(204).json({ message: "No user found." });
    }
    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );
    const updatedUser = await prisma.user.update({
      where: {
        id: foundUser.id,
      },
      data: {
        refreshToken: newRefreshTokenArray,
      },
    });
    process.env.NODE_ENV === "development" &&
      console.log("Updating refresh Token in ", updatedUser);
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
    process.env.NODE_ENV === "development" &&
      console.log("Userfound and deleting cookies");
    res.status(204).json({ message: "Logout Successful" });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { handleLogout };
