import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// AI
export const generateAI = (data) => API.post("/ai/generate", data);

// Billing
export const createCheckout = () => API.post("/billing/create-checkout");
export const getUsage = () => API.get("/billing/usage");