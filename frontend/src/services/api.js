import axios from "axios";

/* ===============================
   AXIOS INSTANCE
=============================== */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,  // 👈 from .env
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   REQUEST INTERCEPTOR
=============================== */
api.interceptors.request.use(
  (config) => {
    // TOKEN
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ROLE + USER (optional)
    const role = localStorage.getItem("role");
    const userEmail = localStorage.getItem("userEmail");

    if (role) config.headers.role = role;
    if (userEmail) config.headers.user = userEmail;

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   RESPONSE INTERCEPTOR
=============================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // AUTO LOGOUT IF TOKEN EXPIRED
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;