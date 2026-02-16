import { useEffect, useState } from "react";
import api from "../services/api";
import "./Report.css";

export default function CustomerIncidentManagement() {

  const [incidents, setIncidents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    severity: "MEDIUM",
  });

  useEffect(() => {
    loadIncidents();
  }, []);

  // LOAD INCIDENTS
  const loadIncidents = async () => {
    try {
      const res = await api.get("/incidents");
      setIncidents(res.data);
    } catch {
      setError("Failed to load tickets");
    }
  };

  // CREATE TICKET
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

  // UPDATE TICKET
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

  // DELETE TICKET
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;

    try {
      await api.delete(`/incidents/${id}`);
      setIncidents(incidents.filter((i) => i.id !== id));
    } catch {
      setError("Delete failed");
    }
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      subject: "",
      description: "",
      severity: "MEDIUM",
    });
    setEditingId(null);
    setError(null);
  };

  return (
    <div className="report-container">

      <h1>🎫 Customer Ticket Portal</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* CREATE / UPDATE FORM */}
      <form onSubmit={editingId ? handleUpdate : handleCreate}>

        <input
          placeholder="Ticket Subject"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Ticket Description"
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
          {editingId ? "Update Ticket" : "Create Ticket"}
        </button>
      </form>

      <hr />

      {/* TICKET LIST */}
      {incidents.map((incident) => (
        <div key={incident.id} className="card">

          <div className="card-header">
            <h3>{incident.subject}</h3>

            <span className={`status ${incident.status}`}>
              {incident.status}
            </span>
          </div>

          <p><strong>Request ID:</strong> {incident.request_id}</p>

          <p><strong>Description:</strong> {incident.description}</p>

          <p>
            <strong>Severity:</strong> {incident.severity}
          </p>

          <p>
            <strong>Created:</strong>{" "}
            {incident.created_date
              ? new Date(incident.created_date).toLocaleString()
              : "-"}
          </p>

          {incident.closed_date && (
            <p>
              <strong>Closed:</strong>{" "}
              {new Date(incident.closed_date).toLocaleString()}
            </p>
          )}

          {/* BUTTONS */}
          <button
            className="btn btn-edit"
            onClick={() => {
              setEditingId(incident.id);
              setFormData({
                subject: incident.subject,
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
