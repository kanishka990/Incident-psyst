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

  const [customerName, setCustomerName] = useState(
    localStorage.getItem("customerName") || ""
  );

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    severity: "MEDIUM",
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
        status: "PENDING",
      });

      setIssues([res.data, ...issues]);

      setFormData({
        subject: "",
        description: "",
        severity: "MEDIUM",
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
    return colors[severity];
  };

  // FILTER
  const filteredIssues = issues.filter((i) => {
    const matchSearch =
      i.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      !statusFilter || i.status === statusFilter;

    return matchSearch && matchStatus;
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

            <div className="form-group">
              <label>Severity</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success">
              Submit Ticket
            </button>

          </form>
        </div>
      )}

      {/* TICKETS */}
      <div className="issues-section">
        <h2>Your Tickets ({filteredIssues.length})</h2>

        <div className="issues-list">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="issue-card">

              <h3>{issue.subject}</h3>

              <div className="badges">
                <span
                  className="badge"
                  style={{ backgroundColor: getSeverityColor(issue.severity) }}
                >
                  {issue.severity}
                </span>

                <span
                  className="badge"
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                >
                  {issue.status}
                </span>
              </div>

              <p>{issue.description}</p>

              <small>
                Created: {new Date(issue.created_at).toLocaleString()}
              </small>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
