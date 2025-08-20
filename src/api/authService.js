// src/api/authService.js
import api from "./axios";

const signup = async (signupData) => {
    const res = await api.post("/auth/signup", signupData);
    if (res.data?.token) {
        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
    }
    return res.data;
};

const signin = async (credentials) => {
    const res = await api.post("/auth/signin", credentials);
    if (res.data?.token) {
        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
    }
    return res.data;
};

const refresh = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");
    const res = await api.post("/auth/refresh", { refreshToken });
    localStorage.setItem("accessToken", res.data.token);
    return res.data;
};

// Google OAuth
const googleLogin = (code) => api.post(`/auth/google?code=${code}`);

// Forgot password: sends email with reset link
export const forgotPassword = (email) =>
    api.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`);

// Reset password: uses token + newPassword
export const resetPassword = (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword });

export default {
    signup,
    signin,
    refresh,
    googleLogin,
    forgotPassword,
    resetPassword,
};
