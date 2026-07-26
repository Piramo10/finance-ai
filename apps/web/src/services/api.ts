import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Interceptor para adicionar o Token automaticamente em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("finance-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
