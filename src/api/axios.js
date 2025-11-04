// src/api/axios.js
import axios from "axios";

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

const api = axios.create({
  baseURL: "http://localhost:8080/api", // adjust if deployed
  headers: { "Content-Type": "application/json" },
});

// SINGLE request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

    const payload = decodeJwtPayload(token);
    const userId = payload?.id ?? payload?.userId ?? null;
    const userName = payload?.username || payload?.sub || "";

    if (userId) config.headers["X-User-Id"] = String(userId);
    // Backend header is optional, but we send it if present
    config.headers["X-User-Name"] = userName;
  }
  return config;
});

// Response interceptor (basic)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error?.response && [401, 403, 500].includes(error.response.status)) {
    //   localStorage.removeItem("accessToken");
    //   localStorage.removeItem("refreshToken");
    //   window.location.href = "/login";
    // }
    return Promise.reject(error);
  }
);

export default api;
