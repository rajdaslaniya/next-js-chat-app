import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";

const apiService: AxiosInstance = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "https://node-js-chat-app-1.onrender.com",
});

apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers["x-requires-token"] !== "false") {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Token expired or invalid.");
      toast.error("Unauthorized user");
    }
    return Promise.reject(error);
  }
);

export default apiService;
