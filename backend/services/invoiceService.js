const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all invoices
const getAllInvoices = async () => {
  return await prisma.invoiceData.findMany({
    include: {
      items: true, // Include related invoice items
    },
  });
};

// Get invoice by ID
const getInvoiceById = async (id) => {
  return await prisma.invoiceData.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });
};

// Modify an invoice
const updateInvoice = async (id, data) => {
  const { id: _, items, ...updateData } = data;

  return await prisma.invoiceData.update({
    where: { id },
    data: {
      ...updateData,
      items: {
        deleteMany: {}, // Removes all previous items
        create: data.items.map(
          ({
            id,
            invoiceId,
            quantity,
            rate,
            amount,
            gstRate,
            cgstRate,
            sgstRate,
            igstRate,
            ...rest
          }) => ({
            ...rest,
            quantity: Number(quantity),
            rate: parseFloat(rate),
            amount: parseFloat(amount),
            gstRate: parseFloat(gstRate),
            cgstRate: parseFloat(cgstRate),
            sgstRate: parseFloat(sgstRate),
            igstRate: parseFloat(igstRate),
          })
        ),
      },
    },
  });
};

// Delete an invoice
const deleteInvoice = async (id) => {
  await prisma.invoiceItem.deleteMany({
    where: { invoiceId: id }, // Delete all items linked to the invoice
  });

  // Now delete the invoice
  return await prisma.invoiceData.delete({
    where: { id },
  });
};

const createInvoice = async (data) => {
  return await prisma.invoiceData.create({
    data: {
      ...data,
      items: {
        create: data.items.map(
          ({
            id,
            invoiceId,
            quantity,
            rate,
            amount,
            gstRate,
            cgstRate,
            sgstRate,
            igstRate,
            ...rest
          }) => ({
            ...rest,
            quantity: Number(quantity),
            rate: parseFloat(rate),
            amount: parseFloat(amount),
            gstRate: parseFloat(gstRate),
            cgstRate: parseFloat(cgstRate),
            sgstRate: parseFloat(sgstRate),
            igstRate: parseFloat(igstRate),
          })
        ),
      },
    },
    include: {
      items: true,
    },
  });
};

module.exports = {
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  createInvoice,
};
