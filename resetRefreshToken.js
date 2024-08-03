const prisma = require("./config/prismaClient");

async function main() {
  const result = await prisma.user.update({
    where: {
      id: "66aa6953bd130433350e070b",
    },
    data: {
      refreshToken: [],
    },
  });
  console.log(result);
}
main();
