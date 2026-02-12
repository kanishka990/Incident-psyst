import { useEffect, useState } from "react";
import api from "../services/api";
import "./Report.css";

export default function DeveloperIncidentManagement() {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    const res = await api.get("/incidents");
    setIncidents(res.data);
  };

  // ✅ RESOLVE ISSUE
  const handleResolve = async (id) => {
    try {
      const res = await api.put(`/incidents/${id}`, {
        status: "RESOLVED",
      });

      setIncidents(
        incidents.map((i) =>
          i.id === id ? res.data.data || res.data : i
        )
      );
    } catch {
      setError("Resolve failed");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this incident?")) return;

    await api.delete(`/incidents/${id}`);
    setIncidents(incidents.filter((i) => i.id !== id));
  };

  return (
    <div className="report-container">
      <h1>Developer Incident Dashboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Resolve</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td>#{incident.id}</td>
              <td>{incident.title}</td>
              <td>{incident.severity}</td>
              <td>{incident.status}</td>

              <td>
                {incident.status !== "RESOLVED" && (
                  <button
                    className="btn btn-save"
                    onClick={() => handleResolve(incident.id)}
                  >
                    Resolve
                  </button>
                )}
              </td>

              <td>
                <button
                  className="btn btn-delete"
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
