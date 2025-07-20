import axiosInstance from "./instance";

// Get all clients
export const fetchClients = async () => {
  const response = await axiosInstance.get("/clients");
  return response.data;
};

// Get client by ID
export const fetchClientById = async (id: string) => {
  const response = await axiosInstance.get(`/clients/${id}`);
  return response.data;
};

// Create a new client
export const createClient = async (data: any) => {
  const response = await axiosInstance.post("/clients", data);
  return response.data;
};

// Update client details
export const updateClientById = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/clients/${id}`, data);
  return response.data;
};

// Delete a client
export const deleteClientById = async (id: string) => {
  const response = await axiosInstance.delete(`/clients/${id}`);
  return response.data;
};
