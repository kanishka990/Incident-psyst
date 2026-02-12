import { useEffect, useState } from "react";
import {
  fetchUpdates,
  createUpdate,
  updateUpdate,
  deleteUpdate,
} from "../services/update.service";
import "./Updates.css";

export default function Updates() {
  const [updates, setUpdates] = useState([]);
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [formData, setFormData] = useState({
    incident_id: "",
    message: "",
    update_type: "GENERAL",
  });

  // Fetch all updates
  useEffect(() => {
    loadUpdates();
  }, []);

  // Filter updates when search or type changes
  useEffect(() => {
    let filtered = updates;

    if (searchTerm) {
      filtered = filtered.filter((u) =>
        u.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((u) => u.update_type === typeFilter);
    }

    setFilteredUpdates(filtered);
  }, [updates, searchTerm, typeFilter]);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUpdates();
      setUpdates(data || []);
    } catch (err) {
      console.error("Error loading updates:", err);
      setError("Failed to load updates. Please check if backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle create new update
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (!formData.message.trim()) {
        setError("Message is required");
        return;
      }

      const newUpdate = await createUpdate(formData);
      setUpdates([newUpdate, ...updates]);
      setFormData({ incident_id: "", message: "", update_type: "GENERAL" });
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error("Error creating update:", err);
      setError("Failed to create update");
    }
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!formData.message.trim()) {
        setError("Message is required");
        return;
      }

      const updatedUpdate = await updateUpdate(editingId, {
        message: formData.message,
        update_type: formData.update_type,
      });
      setUpdates(
        updates.map((u) => (u.id === editingId ? updatedUpdate : u))
      );
      setFormData({ incident_id: "", message: "", update_type: "GENERAL" });
      setEditingId(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error("Error updating update:", err);
      setError("Failed to update update");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this update?")) {
      try {
        await deleteUpdate(id);
        setUpdates(updates.filter((u) => u.id !== id));
        setError(null);
      } catch (err) {
        console.error("Error deleting update:", err);
        setError("Failed to delete update");
      }
    }
  };

  // Handle edit button click
  const handleEditClick = (update) => {
    setFormData({
      incident_id: update.incident_id || "",
      message: update.message,
      update_type: update.update_type,
    });
    setEditingId(update.id);
    setShowForm(true);
    setError(null);
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ incident_id: "", message: "", update_type: "GENERAL" });
    setError(null);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "GENERAL":
        return "#6c757d";
      case "INCIDENT":
        return "#007bff";
      case "MAINTENANCE":
        return "#ffc107";
      case "RESOLVED":
        return "#28a745";
      case "ALERT":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  if (loading) {
    return (
      <div className="updates-container">
        <div className="loading">
          <p>Loading updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="updates-container">
      <div className="updates-header">
        <h1>Updates Management</h1>
        <p className="subtitle">Create and manage system updates and incident notifications</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="updates-toolbar">
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ incident_id: "", message: "", update_type: "GENERAL" });
          }}
        >
          + New Update
        </button>

        <input
          type="text"
          className="search-input"
          placeholder="Search updates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button className="btn btn-secondary" onClick={loadUpdates}>
          Refresh
        </button>
      </div>

      <div className="updates-filters">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="GENERAL">General</option>
          <option value="INCIDENT">Incident</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="RESOLVED">Resolved</option>
          <option value="ALERT">Alert</option>
        </select>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="form-card">
          <h2>{editingId ? "Edit Update" : "Create New Update"}</h2>
          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter update message"
                rows="5"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="update_type">Update Type</label>
                <select
                  id="update_type"
                  name="update_type"
                  value={formData.update_type}
                  onChange={handleInputChange}
                >
                  <option value="GENERAL">General</option>
                  <option value="INCIDENT">Incident</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="ALERT">Alert</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="incident_id">Incident ID (Optional)</label>
                <input
                  type="number"
                  id="incident_id"
                  name="incident_id"
                  value={formData.incident_id}
                  onChange={handleInputChange}
                  placeholder="Link to incident"
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-success">
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Updates List */}
      <div className="updates-list-container">
        <div className="list-header">
          <h2>
            Updates ({filteredUpdates.length} of {updates.length})
          </h2>
        </div>

        {filteredUpdates.length === 0 ? (
          <div className="empty-state">
            <p>No updates found</p>
            <small>Create a new update or adjust your filters</small>
          </div>
        ) : (
          <div className="updates-cards">
            {filteredUpdates.map((update) => (
              <div key={update.id} className="update-card">
                <div className="update-header">
                  <span className="update-id">#{update.id}</span>
                  <span
                    className="badge type-badge"
                    style={{ backgroundColor: getTypeColor(update.update_type) }}
                  >
                    {update.update_type}
                  </span>
                </div>
                <div className="update-body">
                  <p className="update-message">{update.message}</p>
                </div>
                <div className="update-footer">
                  <div className="update-meta">
                    {update.incident_id && (
                      <span className="incident-link">
                        Incident #{update.incident_id}
                      </span>
                    )}
                    <span className="update-date">
                      {update.created_at
                        ? new Date(update.created_at).toLocaleString()
                        : "-"}
                    </span>
                  </div>
                  <div className="update-actions">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleEditClick(update)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(update.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table View (Alternative) */}
      <div className="table-toggle">
        <details>
          <summary>View as Table</summary>
          {filteredUpdates.length > 0 && (
            <table className="updates-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Message</th>
                  <th>Type</th>
                  <th>Incident ID</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUpdates.map((update) => (
                  <tr key={update.id}>
                    <td className="update-id">#{update.id}</td>
                    <td className="update-message-cell">
                      {update.message.substring(0, 50)}...
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: getTypeColor(update.update_type),
                        }}
                      >
                        {update.update_type}
                      </span>
                    </td>
                    <td>
                      {update.incident_id ? `#${update.incident_id}` : "-"}
                    </td>
                    <td>
                      {update.created_at
                        ? new Date(update.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="actions">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleEditClick(update)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(update.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </details>
      </div>
    </div>
  );
}
