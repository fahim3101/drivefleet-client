import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Global response interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      // Token expired or missing - optionally redirect to login
      // Don't toast on /jwt or /logout to avoid noise
      if (!error.config.url.includes("/jwt") && !error.config.url.includes("/logout")) {
        toast.error("Session expired. Please login again.");
      }
    } else if (status === 403) {
      toast.error(message || "Forbidden: You don't have permission");
    }
    return Promise.reject(error);
  }
);

export default api;
