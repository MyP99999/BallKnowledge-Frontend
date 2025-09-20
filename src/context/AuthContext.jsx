// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../api/authService";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {email, username, roles}
  const [loading, setLoading] = useState(true);

  // Restore user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: payload.id,
          email: payload.sub,
          username: payload.username || payload.sub,
          roles: payload.roles || [],
        });
      } catch (err) {
        console.error("Failed to decode token", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    setLoading(false);
  }, []);

  const register = async ({ username, email, password }) => {
    const data = await authService.signup({ username, email, password });

    // backend should return tokens after signup just like login
    if (data?.token) {
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      setUser({
        email: payload.sub,
        username: payload.username || username,
        roles: payload.roles || [],
      });
    }

    return data;
  };

  const login = async (credentials) => {
    const data = await authService.signin(credentials);
    const payload = JSON.parse(atob(data.token.split(".")[1]));
    setUser({
      email: payload.sub,
      username: payload.username || payload.sub,
      roles: payload.roles || [],
    });
    return data;
  };

  const googleLogin = async (code) => {
    const res = await api.post(`/auth/google?code=${code}`);

    // Save tokens
    localStorage.setItem("accessToken", res.data.token);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    // Decode JWT payload
    const payload = JSON.parse(atob(res.data.token.split(".")[1]));
    setUser({
      email: payload.sub,
      roles: payload.roles || [],
      isExternalAuth: true,
    });

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const refresh = async () => {
    const data = await authService.refresh();
    const payload = JSON.parse(atob(data.token.split(".")[1]));
    setUser({
      email: payload.sub,
      username: payload.username || payload.sub,
      roles: payload.roles || [],
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
