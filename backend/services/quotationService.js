const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new quotation
const createQuotation = async (data) => {
  const { items, ...quotationData } = data;

  return await prisma.quotationData.create({
    data: {
      ...quotationData,
      items: {
        create: items.map((item) => {
          const { id, quotationId, ...itemData } = item;

          return {
            ...itemData,
            quantity: Number(item.quantity),
            rate: parseFloat(item.rate),
            amount: parseFloat(item.amount),
            gstRate: parseFloat(item.gstRate),
            cgstRate: parseFloat(item.cgstRate),
            sgstRate: parseFloat(item.sgstRate),
            igstRate: parseFloat(item.igstRate),
          };
        }),
      },
    },
    include: {
      items: true,
    },
  });
};

// Get a single quotation by ID
const getQuotationById = async (id) => {
  return await prisma.quotationData.findUnique({
    where: { id },
    include: { items: true },
  });
};

// Get all quotations
const getAllQuotations = async () => {
  return await prisma.quotationData.findMany({
    include: { items: true },
  });
};

// Update a quotation
const updateQuotation = async (id, data) => {
  const { id: _, items, ...updateData } = data;

  const existingQuotation = await prisma.quotationData.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!existingQuotation) {
    throw new Error(`Quotation with ID ${id} not found`);
  }

  const sanitizedItems = items.map((item) => ({
    name: item.name,
    quantity: Number(item.quantity),
    rate: Number(item.rate),
    amount: Number(item.amount),
    gstRate: Number(item.gstRate),
    cgstRate: Number(item.cgstRate),
    sgstRate: Number(item.sgstRate),
    igstRate: Number(item.igstRate),
    hsnCode: item.hsnCode,
  }));

  return await prisma.quotationData.update({
    where: { id },
    data: {
      ...updateData,
      items: {
        deleteMany: {}, // delete old items
        create: sanitizedItems,
      },
    },
    include: {
      items: true,
    },
  });
};

// Delete a quotation
const deleteQuotation = async (id) => {
  return await prisma.quotationData.delete({
    where: { id },
  });
};

module.exports = {
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  createQuotation,
};
