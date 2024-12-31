import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

const apiService: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: "https://node-js-chat-app-1.onrender.com",
});

apiService.interceptors.request.use(
  (config) => {
    const loader = document.getElementsByClassName("loader-container");
    if (loader[0]) {
      (loader[0] as HTMLElement).style.display = "flex";
    }
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiService.interceptors.response.use(
  (response) => {
    const loader = document.getElementsByClassName("loader-container");
    if (loader[0]) {
      (loader[0] as HTMLElement).style.display = "none";
    }
    return response;
  },
  (error) => {
    const loader = document.getElementsByClassName("loader-container");
    if (loader[0]) {
      (loader[0] as HTMLElement).style.display = "none";
    }
    if (error.response?.status === 401) {
      console.error("Token expired or invalid.");
      toast.error("Unauthorized user");
    }
    return Promise.reject(error);
  }
);

export default apiService;
