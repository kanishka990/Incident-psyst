import { useEffect, useState } from "react";
import api from "../services/api";
import "./Report.css";


export default function CustomerIncidentManagement() {
  const [incidents, setIncidents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "MEDIUM",
  });

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    const res = await api.get("/incidents");
    setIncidents(res.data);
  };

  // ✅ CREATE
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/incidents", formData);
      setIncidents([res.data, ...incidents]);
      resetForm();
    } catch {
      setError("Create failed");
    }
  };

  // ✅ UPDATE (Customer can edit title & description)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/incidents/${editingId}`, formData);

      setIncidents(
        incidents.map((i) =>
          i.id === editingId ? res.data.data || res.data : i
        )
      );

      resetForm();
    } catch {
      setError("Update failed");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this incident?")) return;

    try {
      await api.delete(`/incidents/${id}`);
      setIncidents(
        incidents.filter((i) => i.id !== id)
    );
        
    
    } catch (err){
      console.error(err);
      setError("Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      severity: "MEDIUM",
    });
    setEditingId(null);
    setError(null);
  };

  return (
    <div className="report-container">
      <h1>Customer Incident Portal</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={editingId ? handleUpdate : handleCreate}>
        <input
          placeholder="Issue Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Issue Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <select
          value={formData.severity}
          onChange={(e) =>
            setFormData({ ...formData, severity: e.target.value })
          }
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <button className="btn btn-save">
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      <hr />

      {incidents.map((incident) => (
        <div key={incident.id} className="card">
          <h3>{incident.title}</h3>
          <p>{incident.description}</p>
          <p>Status: {incident.status}</p>

          <button
            className="btn btn-edit"
            onClick={() => {
              setEditingId(incident.id);
              setFormData({
                title: incident.title,
                description: incident.description,
                severity: incident.severity,
              });
            }}
          >
            Edit
          </button>

          <button
            className="btn btn-delete"
            onClick={() => handleDelete(incident.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
