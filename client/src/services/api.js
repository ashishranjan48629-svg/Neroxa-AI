import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const loginUser      = (data) => API.post("/api/auth/login", data);
export const registerUser   = (data) => API.post("/api/auth/register", data);
export const googleAuthUser = (data) => API.post("/api/auth/google", data);

// AI
export const generateAI     = (data) => API.post("/api/ai/chat", data);

// User
export const getMe          = ()     => API.get("/api/user/me");
export const updateProfile  = (data) => API.put("/api/user/profile", data);
export const updateSettings = (data) => API.put("/api/user/settings", data);

// Chats
export const getChats       = ()     => API.get("/api/chats");
export const createChat     = (data) => API.post("/api/chats", data);
export const updateChat     = (id, data) => API.put(`/api/chats/${id}`, data);  // ✅ NEW
export const deleteChat     = (id)   => API.delete(`/api/chats/${id}`);

export default API;