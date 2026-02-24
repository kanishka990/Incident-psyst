import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";
console.log("authService - API_URL:", API_URL);
console.log("authService - Full login URL:", `${API_URL}/api/auth/login`);

export const login = (email, password) => {
  console.log("Sending login request to:", `${API_URL}/api/auth/login`);
  return axios.post(`${API_URL}/api/auth/login`, { email, password });
};

export const register = (data) => {
  return axios.post(`${API_URL}/api/auth/register`, data);
};