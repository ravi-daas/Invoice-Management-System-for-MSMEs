import axiosInstance from "./instance";

// Get all invoices
export const fetchInvoices = async () => {
  const response = await axiosInstance.get("/invoices");
  return response.data;
};

// Get invoice by ID
export const fetchInvoiceById = async (id: string) => {
  const response = await axiosInstance.get(`/invoices/${id}`);
  return response.data;
};

// Update invoice
export const updateInvoiceById = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/invoices/${id}`, data);
  return response.data;
};

// Delete invoice
export const deleteInvoice = async (id: string) => {
  const response = await axiosInstance.delete(`/invoices/${id}`);
  return response.data;
};

// Create invoice
export const createInvoice = async (data: any) => {
  const response = await axiosInstance.post("/invoices", data);
  return response.data;
};
