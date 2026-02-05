import axios, { AxiosError } from "axios";

<<<<<<< HEAD
const URL = import.meta.env.VITE_API_URL;

console.log(URL);
=======
const API_URL = "http://localhost:3000/api";
>>>>>>> 5795303c9a4d90118ac020e5cb21a9fd84d2522e

const api = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("codex-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    // Return the response data if possible, otherwise the error
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);

export default api;
