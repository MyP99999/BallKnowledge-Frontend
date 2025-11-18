// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../api/authService";
import api from "../api/axios";

const AuthContext = createContext();

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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {id, email, username, roles}
  const [loading, setLoading] = useState(true);
  const [statsTrigger, setStatsTrigger] = useState(0);

  // Restore user from accessToken on app start
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload) {
        setUser({
          id: payload.id ?? payload.userId ?? null,
          email: payload.sub,
          username: payload.username || payload.sub,
          roles: payload.roles || [],
        });
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    setLoading(false);
  }, []);

  const refreshStats = () => setStatsTrigger((x) => x + 1);

  const register = async ({ username, email, password }) => {
    const data = await authService.signup({ username, email, password });
    if (data?.token) {
      localStorage.setItem("accessToken", data.token);
      if (data.refreshToken)
        localStorage.setItem("refreshToken", data.refreshToken);
      const payload = decodeJwtPayload(data.token);
      if (payload) {
        setUser({
          id: payload.id ?? payload.userId ?? null,
          email: payload.sub,
          username: payload.username || username,
          roles: payload.roles || [],
        });
      }
    }
    return data;
    // If signup doesn't return tokens, keep as-is and rely on subsequent login.
  };

  const login = async (credentials) => {
    const data = await authService.signin(credentials);
    // Save tokens
    localStorage.setItem("accessToken", data.token);
    if (data.refreshToken)
      localStorage.setItem("refreshToken", data.refreshToken);

    const payload = decodeJwtPayload(data.token);
    setUser({
      id: payload?.id ?? payload?.userId ?? null,
      email: payload?.sub,
      username: payload?.username || payload?.sub,
      roles: payload?.roles || [],
    });
    return data;
  };

  const googleLogin = async (code) => {
    const res = await api.post(`/auth/google?code=${code}`);

    // Save tokens
    localStorage.setItem("accessToken", res.data.token);
    if (res.data.refreshToken) {
      localStorage.setItem("refreshToken", res.data.refreshToken);
    }

    const payload = decodeJwtPayload(res.data.token);
    setUser({
      id: payload?.id ?? payload?.userId ?? null,
      email: payload?.sub,
      username: payload?.username || payload?.sub,
      roles: payload?.roles || [],
      isExternalAuth: true,
    });

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    // optional: navigate to /login here
  };

  const refresh = async () => {
    const data = await authService.refresh();
    // Save tokens
    localStorage.setItem("accessToken", data.token);
    if (data.refreshToken)
      localStorage.setItem("refreshToken", data.refreshToken);

    const payload = decodeJwtPayload(data.token);
    setUser({
      id: payload?.id ?? payload?.userId ?? null,
      email: payload?.sub,
      username: payload?.username || payload?.sub,
      roles: payload?.roles || [],
    });
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        googleLogin,
        logout,
        refresh,
        loading,
        statsTrigger,
        refreshStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
