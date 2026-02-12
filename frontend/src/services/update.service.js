import axios from "axios";

const API_URL = "http://localhost:5000/api/updates";

export const fetchUpdates = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createUpdate = async (update) => {
  const response = await axios.post(API_URL, update, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateUpdate = async (id, update) => {
  const response = await axios.put(`${API_URL}/${id}`, update, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteUpdate = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
