import { useEffect, useState } from "react";
import api from "../services/api";
import "./InternalDashboard.css";

export default function InternalDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [services, setServices] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateType, setUpdateType] = useState("INCIDENT");

  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [incidentsRes, servicesRes, updatesRes] = await Promise.all([
        api.get("/incidents"),
        api.get("/services"),
        api.get("/updates"),
      ]);

      setIncidents(incidentsRes.data || []);
      setServices(servicesRes.data || []);
      setUpdates(updatesRes.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpdate = async (e) => {
    e.preventDefault();

    if (!updateMessage.trim()) {
      alert("Update message is required");
      return;
    }

    try {
      const response = await api.post("/updates", {
        incident_id: selectedIncident.id,
        message: updateMessage,
        update_type: updateType,
      });

      setUpdates([response.data, ...updates]);
      setUpdateMessage("");
      setUpdateType("INCIDENT");

      // Update incident status if resolved
      if (updateType === "RESOLVED") {
        const updated = await api.put(`/incidents/${selectedIncident.id}`, {
          status: "RESOLVED",
        });
        setIncidents(
          incidents.map((i) => (i.id === selectedIncident.id ? updated.data : i))
        );
        setSelectedIncident(updated.data);
      }
    } catch (err) {
      setError("Failed to add update");
      console.error(err);
    }
  };

  const handleUpdateIncidentStatus = async (incidentId, newStatus) => {
    try {
      const response = await api.put(`/incidents/${incidentId}`, {
        status: newStatus,
      });

      setIncidents(
        incidents.map((i) => (i.id === incidentId ? response.data : i))
      );

      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(response.data);
      }
    } catch (err) {
      setError("Failed to update incident status");
      console.error(err);
    }
  };

  const handleUpdateServiceStatus = async (serviceId, newStatus) => {
    try {
      const service = services.find((s) => s.id === serviceId);
      const response = await api.put(`/services/${serviceId}`, {
        name: service.name,
        description: service.description,
        status: newStatus,
      });

      setServices(services.map((s) => (s.id === serviceId ? response.data : s)));
    } catch (err) {
      setError("Failed to update service status");
      console.error(err);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: "#dc3545",
      HIGH: "#fd7e14",
      MEDIUM: "#ffc107",
      LOW: "#20c997",
    };
    return colors[severity] || "#6c757d";
  };

  const getStatusColor = (status) => {
    const colors = {
      OPEN: "#dc3545",
      IN_PROGRESS: "#0d6efd",
      RESOLVED: "#28a745",
    };
    return colors[status] || "#6c757d";
  };

  const getServiceStatusColor = (status) => {
    const colors = {
      OPERATIONAL: "#28a745",
      DEGRADED: "#ffc107",
      DOWN: "#dc3545",
    };
    return colors[status] || "#6c757d";
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = !severityFilter || incident.severity === severityFilter;
    const matchesStatus = !statusFilter || incident.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getIncidentUpdates = (incidentId) => {
    return updates.filter((u) => u.incident_id === incidentId);
  };

  if (loading) {
    return (
      <div className="internal-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="internal-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🛠️ Incident Management Dashboard</h1>
          <p>Monitor, track, and resolve incidents - Internal Team View</p>
        </div>
        <button onClick={loadAllData} className="btn btn-refresh">
          🔄 Refresh Data
        </button>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{incidents.length}</h3>
          <p>Total Incidents</p>
        </div>
        <div className="stat-card alert">
          <h3>{incidents.filter((i) => i.status === "OPEN").length}</h3>
          <p>Open Issues</p>
        </div>
        <div className="stat-card warning">
          <h3>{incidents.filter((i) => i.status === "IN_PROGRESS").length}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card success">
          <h3>{incidents.filter((i) => i.status === "RESOLVED").length}</h3>
          <p>Resolved</p>
        </div>
        <div className="stat-card">
          <h3>{services.length}</h3>
          <p>Services</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-content">
        {/* Left: Incidents List */}
        <div className="incidents-panel">
          <h2>Active Incidents</h2>

          <div className="search-filters">
            <input
              type="text"
              placeholder="🔍 Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Severity</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="incidents-list">
            {filteredIncidents.length === 0 ? (
              <div className="empty-message">No incidents found</div>
            ) : (
              filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`incident-item ${
                    selectedIncident?.id === incident.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedIncident(incident)}
                >
                  <div className="incident-item-header">
                    <h4>#{incident.id} - {incident.title}</h4>
                    <div className="incident-badges">
                      <span
                        className="badge-severity"
                        style={{ backgroundColor: getSeverityColor(incident.severity) }}
                      >
                        {incident.severity}
                      </span>
                      <span
                        className="badge-status"
                        style={{ backgroundColor: getStatusColor(incident.status) }}
                      >
                        {incident.status}
                      </span>
                    </div>
                  </div>
                  <p className="incident-item-desc">{incident.description}</p>
                  <small>
                    Created: {new Date(incident.created_at).toLocaleString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Incident Details */}
        <div className="details-panel">
          {selectedIncident ? (
            <>
              <div className="details-header">
                <h2>Incident #{selectedIncident.id}</h2>
                <div className="close-btn" onClick={() => setSelectedIncident(null)}>
                  ✕
                </div>
              </div>

              <div className="incident-details">
                <div className="detail-field">
                  <label>Title:</label>
                  <p>{selectedIncident.title}</p>
                </div>

                <div className="detail-field">
                  <label>Description:</label>
                  <p>{selectedIncident.description}</p>
                </div>

                <div className="detail-field-row">
                  <div className="detail-field">
                    <label>Severity:</label>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: getSeverityColor(selectedIncident.severity),
                      }}
                    >
                      {selectedIncident.severity}
                    </span>
                  </div>

                  <div className="detail-field">
                    <label>Status:</label>
                    <div className="status-buttons">
                      <button
                        className={`status-btn ${
                          selectedIncident.status === "OPEN" ? "active" : ""
                        }`}
                        style={{
                          borderColor: getStatusColor("OPEN"),
                        }}
                        onClick={() =>
                          handleUpdateIncidentStatus(selectedIncident.id, "OPEN")
                        }
                      >
                        🔴 Open
                      </button>
                      <button
                        className={`status-btn ${
                          selectedIncident.status === "IN_PROGRESS" ? "active" : ""
                        }`}
                        style={{
                          borderColor: getStatusColor("IN_PROGRESS"),
                        }}
                        onClick={() =>
                          handleUpdateIncidentStatus(selectedIncident.id, "IN_PROGRESS")
                        }
                      >
                        🔵 In Progress
                      </button>
                      <button
                        className={`status-btn ${
                          selectedIncident.status === "RESOLVED" ? "active" : ""
                        }`}
                        style={{
                          borderColor: getStatusColor("RESOLVED"),
                        }}
                        onClick={() =>
                          handleUpdateIncidentStatus(selectedIncident.id, "RESOLVED")
                        }
                      >
                        ✅ Resolved
                      </button>
                    </div>
                  </div>
                </div>

                <div className="detail-field">
                  <label>Created:</label>
                  <p>{new Date(selectedIncident.created_at).toLocaleString()}</p>
                </div>

                {selectedIncident.updated_at !== selectedIncident.created_at && (
                  <div className="detail-field">
                    <label>Last Updated:</label>
                    <p>{new Date(selectedIncident.updated_at).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Add Update */}
              <div className="add-update-section">
                <h3>Add Status Update</h3>
                <form onSubmit={handleAddUpdate}>
                  <div className="form-group">
                    <label>Update Type:</label>
                    <select
                      value={updateType}
                      onChange={(e) => setUpdateType(e.target.value)}
                      className="form-control"
                    >
                      <option value="ALERT">🚨 Alert</option>
                      <option value="INCIDENT">📢 Incident</option>
                      <option value="MAINTENANCE">🔧 Maintenance</option>
                      <option value="RESOLVED">✅ Resolved</option>
                      <option value="GENERAL">ℹ️ General</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Message:</label>
                    <textarea
                      value={updateMessage}
                      onChange={(e) => setUpdateMessage(e.target.value)}
                      placeholder="Describe the current status or actions taken..."
                      rows="4"
                      className="form-control"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Post Update
                  </button>
                </form>
              </div>

              {/* Updates Timeline */}
              <div className="updates-section">
                <h3>Updates Timeline</h3>
                <div className="updates-timeline">
                  {getIncidentUpdates(selectedIncident.id).length === 0 ? (
                    <p className="empty-message">No updates yet</p>
                  ) : (
                    getIncidentUpdates(selectedIncident.id).map((update) => (
                      <div key={update.id} className="timeline-item">
                        <div
                          className="timeline-type"
                          style={{
                            backgroundColor:
                              update.update_type === "ALERT"
                                ? "#dc3545"
                                : update.update_type === "INCIDENT"
                                ? "#0d6efd"
                                : update.update_type === "MAINTENANCE"
                                ? "#ffc107"
                                : update.update_type === "RESOLVED"
                                ? "#28a745"
                                : "#6c757d",
                          }}
                        >
                          {update.update_type}
                        </div>
                        <div className="timeline-content">
                          <p>{update.message}</p>
                          <small>
                            {new Date(update.created_at).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select an incident to view details and manage it</p>
            </div>
          )}
        </div>
      </div>

      {/* Services Status Monitor */}
      <div className="services-monitor">
        <h2>Service Status Monitor</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-monitor-card">
              <div className="service-name">{service.name}</div>
              <p className="service-desc">{service.description}</p>
              <div className="service-status-controls">
                <select
                  value={service.status}
                  onChange={(e) =>
                    handleUpdateServiceStatus(service.id, e.target.value)
                  }
                  className="status-select"
                  style={{
                    backgroundColor: getServiceStatusColor(service.status),
                    color: "white",
                  }}
                >
                  <option value="OPERATIONAL">✅ Operational</option>
                  <option value="DEGRADED">⚠️ Degraded</option>
                  <option value="DOWN">❌ Down</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
