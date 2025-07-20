const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createClient = async (data) => {
  return await prisma.client.create({
    data,
  });
};

const getClientById = async (id) => {
  return await prisma.client.findUnique({
    where: { id },
  });
};

const getAllClients = async () => {
  return await prisma.client.findMany();
};

const updateClient = async (id, data) => {
  const { id: _, ...updateData } = data;

  return await prisma.client.update({
    where: {
      id: id,
    },
    data: {
      ...updateData,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    },
  });
};

const deleteClient = async (id) => {
  return await prisma.client.delete({
    where: { id },
  });
};

module.exports = {
  createClient,
  getClientById,
  getAllClients,
  updateClient,
  deleteClient,
};
