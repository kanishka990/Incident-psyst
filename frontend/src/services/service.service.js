import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/api/services";

export const fetchServices = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createService = async (service) => {
  const response = await axios.post(API_URL, service, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateService = async (id, service) => {
  const response = await axios.put(`${API_URL}/${id}`, service, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteService = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
