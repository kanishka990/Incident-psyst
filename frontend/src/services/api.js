import axios from "axios";

/* ===============================
   AXIOS INSTANCE
=============================== */
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   REQUEST INTERCEPTOR
   (AUTO HEADERS)
=============================== */
api.interceptors.request.use(
  (config) => {

    // TOKEN
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    // 🔥 ROLE + USER (important)
    config.headers.role =
      localStorage.getItem("role");

    config.headers.user =
      localStorage.getItem("userEmail");

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

      // redirect safely
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
