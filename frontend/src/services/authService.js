import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export const login = (email, password) => {
  return axios.post(`${API_URL}/auth/login`, { email, password });
};

export const register = (name, email, password, role) => {
  return axios.post(`${API_URL}/auth/register`, { name, email, password, role });
};
