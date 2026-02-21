import { useEffect, useState } from "react";
import api from "../services/api";
import "./CustomerReportIssue.css";

export default function CustomerReportIssue() {

  const [issues, setIssues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  const [customerName, setCustomerName] = useState(
    localStorage.getItem("customerName") || ""
  );

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    severity: "MEDIUM",
    priority: "P2",
  });

  useEffect(() => {
    loadIssues();
  }, []);

  // LOAD DATA
  const loadIssues = async () => {
    try {
      setLoading(true);
      const res = await api.get("/incidents");
      setIssues(res.data || []);
    } catch (err) {
      setError("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  // INPUT HANDLER
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerNameChange = (e) => {
    const name = e.target.value;
    setCustomerName(name);
    localStorage.setItem("customerName", name);
  };

  // CREATE TICKET
  const handleReportIssue = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!formData.subject.trim()) {
      setError("Subject is required");
      return;
    }

    try {
      const res = await api.post("/incidents", {
        subject: formData.subject,
        description: `[Customer: ${customerName}] ${formData.description}`,
        severity: formData.severity,
        priority: formData.priority,
        status: "PENDING",
      });

      setIssues([res.data, ...issues]);

      setFormData({
        subject: "",
        description: "",
        severity: "MEDIUM",
        priority: "P2",
      });

      setShowForm(false);
      setError(null);

    } catch {
      setError("Failed to submit issue");
    }
  };

  // STATUS COLOR
  const getStatusColor = (status) => {
    const colors = {
      PENDING: "#f59e0b",
      IN_PROGRESS: "#3b82f6",
      COMPLETED: "#22c55e",
      CLOSED: "#6b7280",
    };
    return colors[status] || "#999";
  };

  // SEVERITY COLOR
  const getSeverityColor = (severity) => {
    const colors = {
      LOW: "#22c55e",
      MEDIUM: "#f59e0b",
      HIGH: "#ef4444",
      CRITICAL: "#b91c1c",
    };
    return colors[severity] || "#999";
  };

  // PRIORITY COLOR
  const getPriorityColor = (priority) => {
    const colors = {
      P1: "#dc2626",
      P2: "#f59e0b",
      P3: "#22c55e",
    };
    return colors[priority] || "#999";
  };

  // PRIORITY LABEL
  const getPriorityLabel = (priority) => {
    const labels = {
      P1: "PriorityLevel1",
      P2: "PriorityLevel2",
      P3: "PriorityLevel3",
    };
    return labels[priority] || priority;
  };

  // FILTER
  const filteredIssues = issues.filter((i) => {
    const matchSearch =
      i.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.user_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = !statusFilter || i.status === statusFilter;
    const matchPriority = !priorityFilter || i.priority === priorityFilter;
    const matchSeverity = !severityFilter || i.severity === severityFilter;

    return matchSearch && matchStatus && matchPriority && matchSeverity;
  });

  if (loading) {
    return <div className="loading">Loading Tickets...</div>;
  }

  return (
    <div className="customer-page">

      {/* HEADER */}
      <div className="customer-header">
        <h1>🎫 Customer Ticket Portal</h1>
        <p>Create and track your support tickets</p>
      </div>

      {/* CUSTOMER INFO */}
      <div className="customer-info-section">
        <label>Your Name *</label>
        <input
          value={customerName}
          onChange={handleCustomerNameChange}
          placeholder="Enter your name"
          className="customer-name-input"
        />
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* TOOLBAR */}
      <div className="toolbar">

        <input
          className="search-input"
          placeholder="🔍 Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="P1">PriorityLevel1</option>
          <option value="P2">PriorityLevel2</option>
          <option value="P3">PriorityLevel3</option>
        </select>

        <select
          className="filter-select"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="">All Severity</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Ticket"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="form-card">
          <h2>Create Ticket</h2>

          <form onSubmit={handleReportIssue}>

            <div className="form-group">
              <label>Subject *</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Ticket Subject"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe issue..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Severity</label>
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
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="P1">PriorityLevel1</option>
                  <option value="P2">PriorityLevel2</option>
                  <option value="P3">PriorityLevel3</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-success">
              Submit Ticket
            </button>

          </form>
        </div>
      )}

      {/* TICKETS TABLE */}
      <div className="tickets-section">
        <h2>Your Tickets ({filteredIssues.length})</h2>

        <div className="table-container">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Created Date</th>
                <th>Created By</th>
                <th>Closed Date</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Assignee</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">No tickets found</td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td className="ticket-id">#{issue.id}</td>
                    <td className="date-cell">
                      {issue.created_at ? new Date(issue.created_at).toLocaleString() : "N/A"}
                    </td>
                    <td className="created-by-cell">
                      <div className="user-info">
                        <span className="user-name">{issue.user_name || "Unknown"}</span>
                        <span className="user-email">{issue.user_email || "N/A"}</span>
                      </div>
                    </td>
                    <td className="subject-cell">{issue.subject}</td>
                    <td className="description-cell">
                      <div className="description-text">
                        {issue.description?.substring(0, 100)}
                        {issue.description?.length > 100 ? "..." : ""}
                      </div>
                    </td>
                    <td>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(issue.priority) }}
                      >
                        {getPriorityLabel(issue.priority)}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="severity-badge"
                        style={{ backgroundColor: getSeverityColor(issue.severity) }}
                      >
                        {issue.severity}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(issue.status) }}
                      >
                        {issue.status}
                      </span>
                    </td>
                    <td className="date-cell">
                      {issue.closed_at ? new Date(issue.closed_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
