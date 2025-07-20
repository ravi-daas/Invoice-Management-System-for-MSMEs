const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Product & Link to Inventory
const createProduct = async (data) => {
  const inventory = await prisma.inventoryState.findFirst();

  if (!inventory) {
    throw new Error(
      "Inventory not found. Ensure an inventory exists before adding products."
    );
  }
  return await prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      category: data.category,
      quantity: data.quantity,
      price: data.price,
      status: data.status,
      hsnCode: data.hsnCode,
      inventory: {
        connect: { id: inventory.id }, // Ensure we connect to a valid inventory
      },
    },
  });
};

// Get Product by ID
const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id },
    include: { inventory: true },
  });
};

// Get All Products
const getAllProducts = async () => {
  return await prisma.product.findMany({ include: { inventory: true } });
};

// Update Product
const updateProduct = async (id, data) => {
  return await prisma.product.update({
    where: { id }, // Use ID in the WHERE clause
    data: {
      name: data.name,
      sku: data.sku,
      category: data.category,
      quantity: data.quantity,
      price: data.price,
      status: data.status,
      hsnCode: data.hsnCode,
      updatedAt: new Date(), // Ensure updatedAt gets a new timestamp
      inventory: {
        connect: { id: data.inventoryId }, // Ensure inventory connection is valid
      },
    },
  });
};

// Delete Product
const deleteProduct = async (id) => {
  return await prisma.product.delete({ where: { id } });
};

// Create Inventory State
const createInventoryState = async (data) => {
  return await prisma.inventoryState.create({
    data: {
      totalProducts: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      // ✅ Remove `products` or use `{ create: [] }`
      products: { create: [] },
    },
    include: { products: true }, // ✅ Include products if needed
  });
};

// Get Inventory with All Linked Products
const getInventoryWithProducts = async () => {
  return await prisma.inventoryState.findFirst({
    include: { products: true },
  });
};

// Export all services
module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  createInventoryState,
  getInventoryWithProducts,
};
