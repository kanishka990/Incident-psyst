import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/api/incidents";

// ✅ GET
export const fetchIncidents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ✅ POST
export const createIncident = async (incident) => {
  const response = await axios.post(
    API_URL,
    incident,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;   // 🔥 YOU MISSED THIS
};

// ✅ PUT (UPDATE)
export const updateIncident = async (id, status) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    { status },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// ✅ DELETE
export const deleteIncident = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
