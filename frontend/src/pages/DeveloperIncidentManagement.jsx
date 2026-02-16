import { useEffect, useState } from "react";
import api from "../services/api";
import "./Report.css";

export default function DeveloperIncidentManagement() {

  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  /* ===============================
     LOAD ALL INCIDENTS
  =============================== */
  const loadIncidents = async () => {
    try {
      const res = await api.get("/incidents");
      setIncidents(res.data || []);
    } catch (err) {
      setError("Failed to load incidents");
      console.error(err);
    }
  };

  /* ===============================
     UPDATE STATUS
  =============================== */
  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/incidents/${id}`, { status });

      setIncidents(
        incidents.map((i) =>
          i.id === id ? (res.data.data || res.data) : i
        )
      );
    } catch (err) {
      setError("Status update failed");
      console.error(err);
    }
  };

  /* ===============================
     DELETE INCIDENT
  =============================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;

    try {
      await api.delete(`/incidents/${id}`);

      setIncidents(
        incidents.filter((i) => i.id !== id)
      );

    } catch (err) {
      setError("Delete failed");
      console.error(err);
    }
  };

  /* ===============================
     STATUS COLOR
  =============================== */
  const getStatusColor = (status) => {
    const colors = {
      PENDING: "#f59e0b",
      IN_PROGRESS: "#3b82f6",
      COMPLETED: "#22c55e",
      CLOSED: "#6b7280",
    };
    return colors[status] || "#999";
  };

  /* ===============================
     SEVERITY COLOR
  =============================== */
  const getSeverityColor = (severity) => {
    const colors = {
      LOW: "#22c55e",
      MEDIUM: "#f59e0b",
      HIGH: "#ef4444",
      CRITICAL: "#b91c1c",
    };
    return colors[severity] || "#999";
  };

  return (
    <div className="report-container">

      <h1 className="report-title">
        🛠 Developer Ticket Dashboard
      </h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="report-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Update Status</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {incidents.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-state">
                No tickets found
              </td>
            </tr>
          ) : (
            incidents.map((incident) => (
              <tr key={incident.id}>

                <td>#{incident.id}</td>

                <td>{incident.subject}</td>

                <td>
                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        getSeverityColor(incident.severity),
                    }}
                  >
                    {incident.severity}
                  </span>
                </td>

                <td>
                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        getStatusColor(incident.status),
                    }}
                  >
                    {incident.status}
                  </span>
                </td>

                {/* STATUS DROPDOWN */}
                <td>
                  <select
                    value={incident.status}
                    onChange={(e) =>
                      updateStatus(
                        incident.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </td>

                {/* DELETE BUTTON */}
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleDelete(incident.id)
                    }
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>

    </div>
  );
}
