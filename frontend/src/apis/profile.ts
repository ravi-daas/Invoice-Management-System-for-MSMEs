import axiosInstance from "./instance";

// ➤ Get Profile (Only One Profile Allowed)
export const fetchProfile = async () => {
  const response = await axiosInstance.get("/profile");
  return response.data;
};

// ➤ Create or Update Profile
export const upsertProfile = async (data: any) => {
  const response = await axiosInstance.post("/profile", data);
  return response.data;
};
