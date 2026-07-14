import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const login = (data) => {
  return axios.post(`${API}/login`, data);
};

export const register = (data) => {
  return axios.post(`${API}/register`, data);
};

export const saveAuth = (authData) => {
  localStorage.setItem("token", authData.token);
  localStorage.setItem("user", JSON.stringify(authData));
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};