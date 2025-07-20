import axiosInstance from "./instance";

// Get all quotations
export const fetchQuotations = async () => {
  const response = await axiosInstance.get("/quotations");
  return response.data;
};

// Get quotation by ID
export const fetchQuotationById = async (id: string) => {
  const response = await axiosInstance.get(`/quotations/${id}`);
  return response.data;
};

// Update quotation
export const updateQuotationById = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/quotations/${id}`, data);
  return response.data;
};

// Delete quotation
export const deleteQuotation = async (id: string) => {
  const response = await axiosInstance.delete(`/quotations/${id}`);
  return response.data;
};

// Create quotation
export const createQuotation = async (data: any) => {
  const response = await axiosInstance.post("/quotations", data);
  return response.data;
};
