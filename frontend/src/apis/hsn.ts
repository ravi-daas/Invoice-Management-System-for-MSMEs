import axiosInstance from "./instance";

export const getHSNCodeData = async ({
  code,
}: {
  code: string;
}): Promise<{ code: string }> => {
  const response = await axiosInstance.get(`/hsn/${code}`);
  return response.data;
};
