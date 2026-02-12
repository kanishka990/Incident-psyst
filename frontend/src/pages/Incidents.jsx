import { useEffect, useState } from "react";
import api from "../services/api";
import "./Incidents.css";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "MEDIUM",
    status: "OPEN",
  });

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    let filtered = incidents;

    if (searchTerm) {
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (severityFilter) {
      filtered = filtered.filter((i) => i.severity === severityFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((i) => i.status === statusFilter);
    }

    setFilteredIncidents(filtered);
  }, [incidents, searchTerm, severityFilter, statusFilter]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/incidents");
      const data = Array.isArray(response.data) ? response.data : (response.data.value || response.data || []);
      setIncidents(data);
    } catch (err) {
      setError("Failed to load incidents");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/incidents", formData);
      const newIncident = response.data.value || response.data || {};
      setIncidents([newIncident, ...incidents]);
      resetForm();
    } catch {
      setError("Failed to create incident");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/incidents/${editingId}`, formData);
      const updatedData = response.data.value || response.data || formData;
      setIncidents(
        incidents.map((i) =>
          i.id === editingId ? { ...i, ...updatedData } : i
        )
      );
      resetForm();
    } catch (err) {
      setError("Failed to update incident");
    }
  };

  const handleQuickStatusUpdate = async (id, newStatus) => {
    try {
      const response = await api.put(`/incidents/${id}`, {
        status: newStatus,
      });

      const updatedData = response.data.value || response.data || { status: newStatus };
      setIncidents(
        incidents.map((i) =>
          i.id === id ? { ...i, ...updatedData } : i
        )
      );
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this incident?")) return;

    try {
      await api.delete(`/incidents/${id}`);
      setIncidents(incidents.filter((i) => i.id !== id));
    } catch {
      setError("Failed to delete incident");
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    try {
      for (const id of selectedIds) {
        await api.put(`/incidents/${id}`, { status: newStatus });
      }
      loadIncidents();
      setSelectedIds([]);
    } catch {
      setError("Bulk update failed");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      severity: "MEDIUM",
      status: "OPEN",
    });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="incidents-container">
      <h1>Incidents Management</h1>

      {error && <div className="error-banner">{error}</div>}

      <button
        className="btn btn-primary"
        onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
        }}
      >
        + New Incident
      </button>

      {showForm && (
        <div className="form-card">
          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <select
              name="severity"
              value={formData.severity}
              onChange={handleInputChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            {editingId && (
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            )}

            <button type="submit" className="btn btn-success">
              {editingId ? "Update" : "Create"}
            </button>
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <table className="incidents-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncidents.map((incident) => (
            <tr key={incident.id}>
              <td>#{incident.id}</td>
              <td>{incident.title}</td>
              <td>{incident.severity}</td>
              <td>{incident.status}</td>
              <td>
                {incident.created_at
                  ? new Date(incident.created_at).toLocaleDateString()
                  : "-"}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() =>
                    handleQuickStatusUpdate(incident.id, "RESOLVED")
                  }
                >
                  Resolve
                </button>

                <button
                  className="btn btn-sm btn-info"
                  onClick={() => {
                    setEditingId(incident.id);
                    setFormData({
                      title: incident.title,
                      description: incident.description,
                      severity: incident.severity,
                      status: incident.status,
                    });
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(incident.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
