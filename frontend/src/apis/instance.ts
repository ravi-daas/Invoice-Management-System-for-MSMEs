import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Change this if deployed

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
