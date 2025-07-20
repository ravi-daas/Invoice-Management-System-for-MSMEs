const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getHSNDetails = async (hsnPrefix) => {
  return await prisma.hSNCode.findFirst({
    where: {
      hsnCode: {
        startsWith: hsnPrefix,
      },
    },
  });
};

module.exports = { getHSNDetails };
