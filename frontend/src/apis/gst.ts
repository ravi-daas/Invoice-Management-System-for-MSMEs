import { GSTRequest } from "@/types";
import axiosInstance from "./instance";

// Get Captcha for GST Verification
export const getGSTCaptcha = async (): Promise<{
  sessionId: string;
  image: string;
}> => {
  const response = await axiosInstance.get("gst/api/v1/getCaptcha");
  return response.data;
};

// Get GST details using Captcha & GSTIN
export const fetchGSTDetails = async (data: GSTRequest): Promise<any> => {
  const response = await axiosInstance.post("gst/api/v1/getGSTDetails", data);
  return response.data;
};
