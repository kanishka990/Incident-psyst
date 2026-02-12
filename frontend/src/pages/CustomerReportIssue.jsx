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
    title: "",
    description: "",
    severity: "MEDIUM",
  });

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await api.get("/incidents");
      setIssues(response.data || []);
    } catch (err) {
      setError("Failed to load issues");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerNameChange = (e) => {
    const name = e.target.value;
    setCustomerName(name);
    localStorage.setItem("customerName", name);
  };

  const handleReportIssue = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setError("Please enter your name first");
      return;
    }

    if (!formData.title.trim()) {
      setError("Issue title is required");
      return;
    }

    try {
      const response = await api.post("/incidents/value", {
        title: formData.title,
        description: `[Customer: ${customerName}] ${formData.description}`,
        severity: formData.severity,
        status: "OPEN",
      });

      setIssues([response.data, ...issues]);
      setFormData({
        title: "",
        description: "",
        severity: "MEDIUM",
      });
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError("Failed to report issue");
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      OPEN: "#dc3545",
      IN_PROGRESS: "#0d6efd",
      RESOLVED: "#198754",
    };
    return colors[status] || "#6c757d";
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

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || issue.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="customer-page">
        <div className="loading">Loading your issues...</div>
      </div>
    );
  }

  return (
    <div className="customer-page">
      {/* Header */}
      <div className="customer-header">
        <div className="header-content">
          <h1>📋 Report an Issue</h1>
          <p>Let us know if you're experiencing any problems</p>
        </div>
      </div>

      {/* Customer Name Input */}
      <div className="customer-info-section">
        <div className="info-box">
          <label>Your Name *</label>
          <input
            type="text"
            value={customerName}
            onChange={handleCustomerNameChange}
            placeholder="Enter your name"
            className="customer-name-input"
          />
          <span className="info-text">This will be recorded with all your issues</span>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-banner">{error}</div>}

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-filter-group">
          <input
            type="text"
            placeholder="🔍 Search your issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

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

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? "Cancel" : "+ Report New Issue"}
        </button>
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="form-card">
          <h2>Report New Issue</h2>
          <form onSubmit={handleReportIssue}>
            <div className="form-group">
              <label>Issue Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Cannot login to account"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the issue in detail..."
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Severity *</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
              >
                <option value="LOW">🟢 Low - Minor issue, no rush</option>
                <option value="MEDIUM">🟡 Medium - Affects some features</option>
                <option value="HIGH">🟠 High - Major functionality broken</option>
                <option value="CRITICAL">🔴 Critical - System down</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success">
              Submit Issue
            </button>
          </form>
        </div>
      )}

      {/* Issues List */}
      <div className="issues-section">
        <h2>Your Reported Issues ({filteredIssues.length})</h2>

        {filteredIssues.length === 0 ? (
          <div className="empty-state">
            <p>✨ No issues reported yet</p>
            <small>Click "Report New Issue" to get started</small>
          </div>
        ) : (
          <div className="issues-list">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="issue-card">
                <div className="issue-header">
                  <div className="issue-title-section">
                    <h3>#{issue.id} - {issue.title}</h3>
                    <div className="badges">
                      <span
                        className="badge badge-severity"
                        style={{ backgroundColor: getSeverityColor(issue.severity) }}
                      >
                        {issue.severity}
                      </span>
                      <span
                        className="badge badge-status"
                        style={{ backgroundColor: getStatusColor(issue.status) }}
                      >
                        {issue.status === "OPEN"
                          ? "🔴 Open"
                          : issue.status === "IN_PROGRESS"
                          ? "🔵 In Progress"
                          : "✅ Resolved"}
                      </span>
                    </div>
                  </div>
                  <div className="issue-date">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="issue-description">
                  <p>{issue.description}</p>
                </div>

                <div className="issue-footer">
                  <small>
                    Created: {new Date(issue.created_at).toLocaleString()}
                  </small>
                  {issue.updated_at !== issue.created_at && (
                    <small>
                      Updated: {new Date(issue.updated_at).toLocaleString()}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="stats-section">
        <div className="stat-box">
          <h3>{filteredIssues.length}</h3>
          <p>Total Issues</p>
        </div>
        <div className="stat-box">
          <h3>
            {filteredIssues.filter((i) => i.status === "OPEN").length}
          </h3>
          <p>Open</p>
        </div>
        <div className="stat-box">
          <h3>
            {filteredIssues.filter((i) => i.status === "IN_PROGRESS").length}
          </h3>
          <p>In Progress</p>
        </div>
        <div className="stat-box">
          <h3>
            {filteredIssues.filter((i) => i.status === "RESOLVED").length}
          </h3>
          <p>Resolved</p>
        </div>
      </div>
    </div>
  );
}
