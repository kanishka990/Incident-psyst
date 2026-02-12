import { useEffect, useState } from "react";
import api from "../services/api";
import "./PublicStatusPage.css";

export default function PublicStatusPage() {
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    loadAllData();
    // Auto refresh every 30 seconds
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [servicesRes, incidentsRes, updatesRes] = await Promise.all([
        api.get("/services"),
        api.get("/incidents"),
        api.get("/updates"),
      ]);

      setServices(servicesRes.data || []);
      setIncidents(incidentsRes.data || []);
      setUpdates(updatesRes.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load status information");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      OPERATIONAL: "✅",
      DEGRADED: "⚠️",
      DOWN: "❌",
    };
    return icons[status] || "❓";
  };

  const getStatusColor = (status) => {
    const colors = {
      OPERATIONAL: "#28a745",
      DEGRADED: "#ffc107",
      DOWN: "#dc3545",
    };
    return colors[status] || "#6c757d";
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      CRITICAL: { icon: "🔴", label: "Critical", color: "#dc3545" },
      HIGH: { icon: "🟠", label: "High", color: "#fd7e14" },
      MEDIUM: { icon: "🟡", label: "Medium", color: "#ffc107" },
      LOW: { icon: "🟢", label: "Low", color: "#20c997" },
    };
    return badges[severity] || { icon: "⚪", label: severity, color: "#6c757d" };
  };

  const getIncidentStatusBadge = (status) => {
    const badges = {
      OPEN: { icon: "🔴", label: "Open", color: "#dc3545" },
      IN_PROGRESS: { icon: "🔵", label: "In Progress", color: "#0d6efd" },
      RESOLVED: { icon: "✅", label: "Resolved", color: "#28a745" },
    };
    return badges[status] || { icon: "⚪", label: status, color: "#6c757d" };
  };

  const activeIncidents = incidents.filter((i) => i.status !== "RESOLVED");
  const resolvedIncidents = incidents.filter((i) => i.status === "RESOLVED");

  const getIncidentUpdates = (incidentId) => {
    return updates.filter((u) => u.incident_id === incidentId).slice(0, 5);
  };

  const calculateUptime = () => {
    if (services.length === 0) return "N/A";
    const operational = services.filter((s) => s.status === "OPERATIONAL").length;
    return Math.round((operational / services.length) * 100);
  };

  if (loading) {
    return (
      <div className="public-status-page">
        <div className="loading-spinner">Loading system status...</div>
      </div>
    );
  }

  return (
    <div className="public-status-page">
      {/* Hero Section */}
      <div className="status-hero">
        <div className="hero-content">
          <h1>System Status</h1>
          <p>Real-time status of our services and systems</p>
          <div className="uptime-badge">
            <span className="uptime-percentage">{calculateUptime()}%</span>
            <span className="uptime-text">System Uptime (Today)</span>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="status-summary">
        <div className="summary-card all-systems">
          <h3>System Status</h3>
          {services.length === 0 ? (
            <p className="status-text">No services</p>
          ) : activeIncidents.length === 0 ? (
            <p className="status-text operational">✅ All Systems Operational</p>
          ) : (
            <p className="status-text warning">
              ⚠️ {activeIncidents.length} Active Incident
              {activeIncidents.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="summary-card">
          <h3>Services</h3>
          <div className="status-counts">
            <div>
              <span className="count">
                {services.filter((s) => s.status === "OPERATIONAL").length}
              </span>
              <span className="label">Operational</span>
            </div>
            <div>
              <span className="count">
                {services.filter((s) => s.status === "DEGRADED").length}
              </span>
              <span className="label">Degraded</span>
            </div>
            <div>
              <span className="count">
                {services.filter((s) => s.status === "DOWN").length}
              </span>
              <span className="label">Down</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <h3>Incidents</h3>
          <div className="status-counts">
            <div>
              <span className="count">{activeIncidents.length}</span>
              <span className="label">Active</span>
            </div>
            <div>
              <span className="count">{resolvedIncidents.length}</span>
              <span className="label">Resolved</span>
            </div>
            <div>
              <span className="count">{incidents.length}</span>
              <span className="label">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="services-section">
        <h2>Service Status</h2>
        <div className="services-grid">
          {services.length === 0 ? (
            <p className="empty-message">No services available</p>
          ) : (
            services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-header">
                  <span className="service-status-icon">
                    {getStatusIcon(service.status)}
                  </span>
                  <h3>{service.name}</h3>
                </div>
                <p className="service-description">{service.description}</p>
                <div
                  className="service-status"
                  style={{ backgroundColor: getStatusColor(service.status) }}
                >
                  {service.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Incidents */}
      {activeIncidents.length > 0 && (
        <div className="incidents-section">
          <h2>🚨 Active Incidents ({activeIncidents.length})</h2>
          <div className="incidents-list">
            {activeIncidents.map((incident) => {
              const severity = getSeverityBadge(incident.severity);
              const incidentStatus = getIncidentStatusBadge(incident.status);
              const incidentUpdates = getIncidentUpdates(incident.id);

              return (
                <div
                  key={incident.id}
                  className="incident-card active"
                  onClick={() =>
                    setSelectedIncident(
                      selectedIncident?.id === incident.id ? null : incident
                    )
                  }
                >
                  <div className="incident-header">
                    <div className="incident-title">
                      <span className="severity-badge" style={{ color: severity.color }}>
                        {severity.icon} {severity.label}
                      </span>
                      <h3>#{incident.id} - {incident.title}</h3>
                    </div>
                    <div
                      className="status-badge"
                      style={{ backgroundColor: incidentStatus.color }}
                    >
                      {incidentStatus.icon} {incidentStatus.label}
                    </div>
                  </div>

                  <p className="incident-description">{incident.description}</p>

                  <div className="incident-meta">
                    <small>Started: {new Date(incident.created_at).toLocaleString()}</small>
                  </div>

                  {/* Expandable Updates */}
                  {selectedIncident?.id === incident.id && incidentUpdates.length > 0 && (
                    <div className="incident-updates">
                      <h4>Latest Updates:</h4>
                      <div className="updates-timeline">
                        {incidentUpdates.map((update) => (
                          <div key={update.id} className="update-item">
                            <div className="update-type" style={{
                              backgroundColor: update.update_type === "ALERT" ? "#dc3545" :
                                update.update_type === "INCIDENT" ? "#0d6efd" :
                                update.update_type === "MAINTENANCE" ? "#ffc107" :
                                update.update_type === "RESOLVED" ? "#28a745" : "#6c757d"
                            }}>
                              {update.update_type}
                            </div>
                            <div className="update-content">
                              <p>{update.message}</p>
                              <small>{new Date(update.created_at).toLocaleString()}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="expand-hint">
                    Click to {selectedIncident?.id === incident.id ? "collapse" : "view updates"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resolved Incidents */}
      {resolvedIncidents.length > 0 && (
        <div className="resolved-section">
          <h2>✅ Recently Resolved ({resolvedIncidents.length})</h2>
          <div className="resolved-list">
            {resolvedIncidents.slice(0, 5).map((incident) => {
              const severity = getSeverityBadge(incident.severity);

              return (
                <div key={incident.id} className="resolved-card">
                  <div className="resolved-header">
                    <h4>#{incident.id} - {incident.title}</h4>
                    <span className="severity-small" style={{ color: severity.color }}>
                      {severity.icon} {severity.label}
                    </span>
                  </div>
                  <p>{incident.description}</p>
                  <small>
                    Resolved: {new Date(incident.updated_at).toLocaleString()}
                  </small>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Maintenance Notice */}
      <div className="info-section">
        <p className="info-notice">
          ℹ️ This page is updated automatically every 30 seconds. For urgent issues, please contact support.
        </p>
      </div>
    </div>
  );
}
