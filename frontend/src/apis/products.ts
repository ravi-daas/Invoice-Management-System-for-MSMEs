import axiosInstance from "./instance";

// ➤ Get all products
export const fetchProducts = async () => {
  const response = await axiosInstance.get("/products");
  return response.data;
};

// ➤ Get product by ID
export const fetchProductById = async (id: string) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

// ➤ Update product
export const updateProductById = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/products/${id}`, data);
  return response.data;
};

// ➤ Delete product
export const deleteProductById = async (id: string) => {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};

// ➤ Create product
export const createProduct = async (data: any) => {
  const response = await axiosInstance.post("/products", data);
  return response.data;
};

// ➤ Get inventory (if it doesn't exist, create one)
export const fetchOrCreateInventory = async () => {
  try {
    const response = await axiosInstance.get("/inventory");

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      const newInventory = {
        totalProducts: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        products: [],
      };
      const createResponse = await axiosInstance.post(
        "/inventory",
        newInventory
      );
      return createResponse.data;
    }
    throw error;
  }
};

// ➤ Update inventory
export const updateInventory = async (data: any) => {
  const response = await axiosInstance.put("/inventory", data);
  return response.data;
};
