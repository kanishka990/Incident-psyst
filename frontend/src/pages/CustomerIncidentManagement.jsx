import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import api from "../services/api";
import Chat from "../components/Chat";
import "./CustomerIncidentManagement.css";

export default function CustomerIncidentManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Tab state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Get user info from localStorage
  const userName = localStorage.getItem("userName") || "Customer";
  const userEmail = localStorage.getItem("userEmail") || "";

  // Data states
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Sliding Sidebar for ticket details
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // Form states
  const [editingId, setEditingId] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [newAttachment, setNewAttachment] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [activeDetailTab, setActiveDetailTab] = useState("details");
  
  // Chat & Rating
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Global Search
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    severity: "MEDIUM",
    priority: "P2",
    request_type: "INCIDENT",
    assignee_email: "",
  });

  // SLA Timer
  const [slaCountdown, setSlaCountdown] = useState({});

  // ===============================
  // LOAD TICKETS
  // ===============================
  const loadIncidents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/incidents");
      setIncidents(res.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load tickets");
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD DEVELOPERS
  // ===============================
  const loadDevelopers = async () => {
    try {
      const res = await api.get("/auth/developers");
      setDevelopers(res.data || []);
    } catch (err) {
      setDevelopers([]);
    }
  };

  // ===============================
  // LOAD NOTIFICATIONS
  // ===============================
  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadIncidents();
    loadDevelopers();
    loadNotifications();
  }, []);

  // SLA Countdown Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdown = {};
      incidents.forEach(incident => {
        if (incident.status !== "RESOLVED" && incident.status !== "CLOSED" && incident.created_at) {
          const created = new Date(incident.created_at);
          const now = new Date();
          const hoursDiff = (now - created) / (1000 * 60 * 60);
          
          let slaHours = 24;
          if (incident.priority === "P1" || incident.severity === "CRITICAL") slaHours = 1;
          else if (incident.priority === "P2" || incident.severity === "HIGH") slaHours = 4;
          else if (incident.priority === "P3" || incident.severity === "MEDIUM") slaHours = 8;
          
          const remainingHours = slaHours - hoursDiff;
          if (remainingHours <= 0) {
            newCountdown[incident.id] = { breached: true, time: "SLA Breached" };
          } else {
            const hours = Math.floor(remainingHours);
            const minutes = Math.floor((remainingHours - hours) * 60);
            newCountdown[incident.id] = { 
              breached: false, 
              time: `${hours}h ${minutes}m remaining` 
            };
          }
        }
      });
      setSlaCountdown(newCountdown);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [incidents]);

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  // ===============================
  // CREATE TICKET
  // ===============================
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const userEmail = localStorage.getItem("userEmail") || "";
      const token = localStorage.getItem("token");
      
      const payload = {
        ...formData,
        requester_email: userEmail,
        customer_email: userEmail,
      };

      const res = await api.post("/incidents", payload);

      // Add attachments
      if (newAttachment && res.data?.id) {
        const formDataAttach = new FormData();
        formDataAttach.append("file", newAttachment);
        
        try {
          await api.post(`/incidents/${res.data.id}/attachments`, formDataAttach, {
            headers: { "Content-Type": "multipart/form-data" }
          });
        } catch (attachErr) {
          console.log("Attachment upload failed");
        }
      }

      setIncidents([res.data, ...incidents]);

      setFormData({
        subject: "",
        description: "",
        severity: "MEDIUM",
        priority: "P2",
        request_type: "INCIDENT",
        assignee_email: "",
      });
      setNewAttachment(null);
      
      // Show success notification
      setNotifications([{ id: Date.now(), message: "Ticket created successfully!", type: "success" }, ...notifications]);

    } catch (err) {
      console.error("Create ticket error:", err.response || err);
      setError(err.response?.data?.error || "Create ticket failed");
    }
  };

  // ===============================
  // UPDATE TICKET
  // ===============================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(`/incidents/${editingId}`, formData);

      setIncidents(
        incidents.map((i) =>
          i.id === editingId ? res.data : i
        )
      );

      setEditingId(null);
      setFormData({
        subject: "",
        description: "",
        severity: "MEDIUM",
        priority: "P2",
        request_type: "INCIDENT",
        assignee_email: "",
      });

    } catch {
      setError("Update failed");
    }
  };

  // ===============================
  // ADD COMMENT
  // ===============================
  const handleAddComment = async () => {
    if (!comment.trim() || !selectedIncident) return;

    try {
      await api.post(`/incidents/${selectedIncident.id}/comments`, {
        content: comment,
        author: localStorage.getItem("user")
      });
      
      const res = await api.get(`/incidents/${selectedIncident.id}`);
      setSelectedIncident(res.data);
      setComment("");
    } catch {
      setError("Failed to add comment");
    }
  };

  // ===============================
  // SUBMIT RATING
  // ===============================
  const handleSubmitRating = async () => {
    if (!selectedIncident || rating === 0) return;

    try {
      await api.post(`/incidents/${selectedIncident.id}/rating`, { rating });
      setRatingSubmitted(true);
    } catch {
      setError("Failed to submit rating");
    }
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await api.delete(`/incidents/${id}`);
      setIncidents(incidents.filter((i) => i.id !== id));
      setSidebarOpen(false);
    } catch {
      setError("Delete failed");
    }
  };

  // ===============================
  // VIEW DETAILS - SLIDING SIDEBAR
  // ===============================
  const viewDetails = async (incident) => {
    try {
      const res = await api.get(`/incidents/${incident.id}`);
      setSelectedIncident(res.data);
      setSidebarOpen(true);
      
      try {
        const attachRes = await api.get(`/incidents/${incident.id}/attachments`);
        setAttachments(attachRes.data || []);
      } catch {
        setAttachments([]);
      }
    } catch {
      setError("Failed to load details");
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedIncident(null);
    setAttachments([]);
    setComment("");
    setRating(0);
    setRatingSubmitted(false);
  };

  // ===============================
  // START EDITING
  // ===============================
  const startEdit = (incident) => {
    setEditingId(incident.id);
    setFormData({
      subject: incident.subject,
      description: incident.description,
      severity: incident.severity,
      priority: incident.priority,
      request_type: incident.request_type,
      assignee_email: incident.assignee_email || "",
    });
    setActiveTab("create");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      subject: "",
      description: "",
      severity: "MEDIUM",
      priority: "P2",
      request_type: "INCIDENT",
      assignee_email: "",
    });
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) : "N/A";

  // ===============================
  // FILTERED INCIDENTS (Search)
  // ===============================
  const filteredIncidents = useMemo(() => {
    if (!searchQuery) return incidents;
    const query = searchQuery.toLowerCase();
    return incidents.filter(i => 
      i.subject?.toLowerCase().includes(query) ||
      i.description?.toLowerCase().includes(query) ||
      i.id?.toString().includes(query) ||
      i.status?.toLowerCase().includes(query)
    );
  }, [incidents, searchQuery]);

  // ===============================
  // STATS
  // ===============================
  const totalTickets = incidents.length;
  const openTickets = incidents.filter(i => i.status === "OPEN" || i.status === "NEW").length;
  const inProgress = incidents.filter(i => i.status === "IN_PROGRESS").length;
  const resolved = incidents.filter(i => i.status === "RESOLVED" || i.status === "CLOSED").length;
  
  const avgResolutionTime = useMemo(() => {
    const resolvedIncidents = incidents.filter(i => i.status === "RESOLVED" || i.status === "CLOSED");
    if (resolvedIncidents.length === 0) return "0h";
    
    let totalHours = 0;
    resolvedIncidents.forEach(i => {
      const created = new Date(i.created_at);
      const resolved = new Date(i.updated_at || i.created_at);
      totalHours += (resolved - created) / (1000 * 60 * 60);
    });
    
    const avg = totalHours / resolvedIncidents.length;
    return avg < 1 ? `${Math.round(avg * 60)}m` : `${avg.toFixed(1)}h`;
  }, [incidents]);

  // ===============================
  // PREVIEW DATA
  // ===============================
  const getPreviewData = () => {
    const priorityLabels = {
      "P1": "Highest - Critical response",
      "P2": "High - 4h response",
      "P3": "Medium - 8h response",
      "P4": "Low - 24h response"
    };
    
    const severityLabels = {
      "CRITICAL": "Critical - System down",
      "HIGH": "High - Major impact",
      "MEDIUM": "Medium - Moderate impact",
      "LOW": "Low - Minor issue"
    };

    const teamSuggestions = developers.slice(0, 3).map(d => d.name || d.email);

    return {
      priorityLabel: priorityLabels[formData.priority] || "Standard priority",
      severityLabel: severityLabels[formData.severity] || "Standard severity",
      estimatedResponse: formData.priority === "P1" ? "1 hour" : formData.priority === "P2" ? "4 hours" : formData.priority === "P3" ? "8 hours" : "24 hours",
      teamSuggestions
    };
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="jira-dashboard">
      {/* SIDEBAR */}
      <aside className="jira-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🎫</span>
            <span className="logo-text">SupportHub</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "tickets" ? "active" : ""}`}
            onClick={() => setActiveTab("tickets")}
          >
            <span className="nav-icon">📋</span>
            <span>My Tickets</span>
            {openTickets > 0 && <span className="nav-badge">{openTickets}</span>}
          </button>
          
          <button 
            className={`nav-item ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            <span className="nav-icon">➕</span>
            <span>Create Ticket</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info-sidebar">
            <div className="user-avatar-sidebar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name-sidebar">{userName}</span>
              <span className="user-email-sidebar">{userEmail}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="jira-main">
        {/* TOP HEADER */}
        <div className="main-header">
          <div className="header-left">
            <h1>{activeTab === "dashboard" ? "Dashboard" : activeTab === "tickets" ? "My Tickets" : "Create Ticket"}</h1>
          </div>
          
          <div className="header-right">
            {/* Global Search */}
            <div className="global-search">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Notifications */}
            <div className="notification-wrapper">
              <button 
                className="notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </button>
              
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>Notifications</h4>
                    <button onClick={() => setShowNotifications(false)}>✕</button>
                  </div>
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="notification-empty">No notifications</div>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className="notification-item">
                          {n.message || n.content}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ERROR TOAST */}
        {error && (
          <div className="error-toast" onClick={() => setError(null)}>
            ⚠️ {error}
          </div>
        )}

        {/* ================= DASHBOARD TAB ================= */}
        {activeTab === "dashboard" && (
          <div className="dashboard-tab">
            {/* Stat Cards */}
            <div className="stats-grid">
              <div className="stat-card stat-open" onClick={() => setActiveTab("tickets")}>
                <div className="stat-card-icon">🆕</div>
                <div className="stat-card-content">
                  <span className="stat-number">{openTickets}</span>
                  <span className="stat-label">Open Tickets</span>
                </div>
                <div className="stat-card-bg"></div>
              </div>
              
              <div className="stat-card stat-progress" onClick={() => setActiveTab("tickets")}>
                <div className="stat-card-icon">🔄</div>
                <div className="stat-card-content">
                  <span className="stat-number">{inProgress}</span>
                  <span className="stat-label">In Progress</span>
                </div>
                <div className="stat-card-bg"></div>
              </div>
              
              <div className="stat-card stat-resolved" onClick={() => setActiveTab("tickets")}>
                <div className="stat-card-icon">✅</div>
                <div className="stat-card-content">
                  <span className="stat-number">{resolved}</span>
                  <span className="stat-label">Resolved</span>
                </div>
                <div className="stat-card-bg"></div>
              </div>
              
              <div className="stat-card stat-avg" onClick={() => setActiveTab("tickets")}>
                <div className="stat-card-icon">⏱️</div>
                <div className="stat-card-content">
                  <span className="stat-number">{avgResolutionTime}</span>
                  <span className="stat-label">Avg Resolution</span>
                </div>
                <div className="stat-card-bg"></div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h2>Quick Actions</h2>
              <div className="action-cards">
                <div className="action-card" onClick={() => setActiveTab("tickets")}>
                  <div className="action-icon">📋</div>
                  <h3>View My Tickets</h3>
                  <p>Track and manage all your submitted tickets</p>
                </div>
                
                <div className="action-card action-card-primary" onClick={() => setActiveTab("create")}>
                  <div className="action-icon">➕</div>
                  <h3>Create New Ticket</h3>
                  <p>Submit a new support request</p>
                </div>
                
                <div className="action-card" onClick={() => setActiveTab("tickets")}>
                  <div className="action-icon">📈</div>
                  <h3>View Analytics</h3>
                  <p>See your ticket statistics</p>
                </div>
              </div>
            </div>

            {/* Recent Tickets */}
            <div className="recent-tickets-section">
              <h2>Recent Tickets</h2>
              <div className="tickets-list">
                {filteredIncidents.slice(0, 5).map((incident) => (
                  <div 
                    key={incident.id} 
                    className="ticket-row"
                    onClick={() => viewDetails(incident)}
                  >
                    <div className="ticket-row-main">
                      <span className="ticket-id-badge">{incident.request_id || `#${incident.id}`}</span>
                      <span className="ticket-title">{incident.subject}</span>
                    </div>
                    <div className="ticket-row-meta">
                      <span className={`status-chip status-${incident.status?.toLowerCase().replace("_", "-")}`}>
                        {incident.status?.replace("_", " ") || "OPEN"}
                      </span>
                      <span className={`priority-indicator priority-${incident.priority?.toLowerCase()}`}>
                        {incident.priority}
                      </span>
                      <span className="ticket-date">{formatDate(incident.updated_at || incident.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TICKETS TAB ================= */}
        {activeTab === "tickets" && (
          <div className="tickets-tab">
            {loading ? (
              <div className="loading-state">Loading tickets...</div>
            ) : filteredIncidents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No tickets found</h3>
                <p>You haven't submitted any tickets yet.</p>
                <button className="btn-primary" onClick={() => setActiveTab("create")}>
                  Create Your First Ticket
                </button>
              </div>
            ) : (
              <div className="tickets-list-container">
                {filteredIncidents.map((incident) => (
                  <div 
                    key={incident.id} 
                    className="ticket-card"
                    onClick={() => viewDetails(incident)}
                  >
                    <div className="ticket-card-header">
                      <span className="ticket-key">{incident.request_id || `TKT-${incident.id}`}</span>
                      <span className={`status-chip status-${incident.status?.toLowerCase().replace("_", "-")}`}>
                        {incident.status?.replace("_", " ") || "OPEN"}
                      </span>
                    </div>
                    
                    <div className="ticket-card-body">
                      <h3 className="ticket-card-title">{incident.subject}</h3>
                      <p className="ticket-card-desc">{incident.description?.substring(0, 100)}...</p>
                    </div>
                    
                    <div className="ticket-card-footer">
                      <div className="ticket-card-meta">
                        <span className={`priority-badge priority-${incident.priority?.toLowerCase()}`}>
                          {incident.priority}
                        </span>
                        <span className="ticket-card-date">
                          {formatDate(incident.created_at)}
                        </span>
                      </div>
                      
                      {slaCountdown[incident.id] && (
                        <div className={`sla-timer ${slaCountdown[incident.id].breached ? 'breached' : ''}`}>
                          {slaCountdown[incident.id].breached ? '⚠️' : '⏱️'} {slaCountdown[incident.id].time}
                        </div>
                      )}
                      
                      {incident.assignee_email && (
                        <div className="assignee-avatar">
                          {incident.assignee_email.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= CREATE TICKET TAB ================= */}
        {activeTab === "create" && (
          <div className="create-tab">
            <div className="create-layout">
              {/* Left: Form */}
              <div className="create-form-section">
                <form onSubmit={editingId ? handleUpdate : handleCreate} className="jira-form">
                  <div className="form-header">
                    <h2>{editingId ? "Update Ticket" : "Create New Ticket"}</h2>
                    {editingId && (
                      <button type="button" className="btn-cancel-edit" onClick={cancelEdit}>
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="form-body">
                    <div className="form-group">
                      <label>Title <span className="required">*</span></label>
                      <input
                        type="text"
                        placeholder="Enter a short summary of the issue"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description <span className="required">*</span></label>
                      <textarea
                        placeholder="Describe your issue in detail..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={6}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          value={formData.request_type}
                          onChange={(e) =>
                            setFormData({ ...formData, request_type: e.target.value })
                          }
                        >
                          <option value="INCIDENT">Incident</option>
                          <option value="REQUEST">Request</option>
                          <option value="PROBLEM">Problem</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Priority</label>
                        <select
                          value={formData.priority}
                          onChange={(e) =>
                            setFormData({ ...formData, priority: e.target.value })
                          }
                        >
                          <option value="P1">P1 - Highest</option>
                          <option value="P2">P2 - High</option>
                          <option value="P3">P3 - Medium</option>
                          <option value="P4">P4 - Low</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Severity</label>
                        <select
                          value={formData.severity}
                          onChange={(e) =>
                            setFormData({ ...formData, severity: e.target.value })
                          }
                        >
                          <option value="CRITICAL">Critical</option>
                          <option value="HIGH">High</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="LOW">Low</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Attachment (Optional)</label>
                      <div className="file-upload-area">
                        <input
                          type="file"
                          id="file-upload"
                          onChange={(e) => setNewAttachment(e.target.files[0])}
                        />
                        <label htmlFor="file-upload" className="file-upload-label">
                          <span className="upload-icon">📎</span>
                          <span>
                            {newAttachment ? newAttachment.name : "Click to attach a file"}
                          </span>
                        </label>
                        {newAttachment && (
                          <button 
                            type="button" 
                            className="remove-file"
                            onClick={() => setNewAttachment(null)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-footer">
                    <button type="submit" className="btn-submit jira-btn-primary">
                      {editingId ? "Update Ticket" : "Create Ticket"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right: Preview Panel */}
              <div className="create-preview-section">
                <div className="preview-panel">
                  <div className="preview-header">
                    <span className="preview-icon">👁️</span>
                    <h3>Live Preview</h3>
                  </div>

                  <div className="preview-content">
                    {/* Title Preview */}
                    <div className="preview-item">
                      <label>Title</label>
                      <div className="preview-value">
                        {formData.subject || <span className="preview-placeholder">Enter a title...</span>}
                      </div>
                    </div>

                    {/* Description Preview */}
                    <div className="preview-item">
                      <label>Description</label>
                      <div className="preview-value preview-description">
                        {formData.description || <span className="preview-placeholder">Enter a description...</span>}
                      </div>
                    </div>

                    {/* SLA Preview */}
                    <div className="preview-item">
                      <label>SLA Response Time</label>
                      <div className="preview-sla">
                        <span className="sla-countdown">⏱️ {getPreviewData().estimatedResponse}</span>
                      </div>
                    </div>

                    {/* Priority & Severity */}
                    <div className="preview-row">
                      <div className="preview-item">
                        <label>Priority</label>
                        <span className={`priority-badge priority-${formData.priority?.toLowerCase()}`}>
                          {formData.priority}
                        </span>
                      </div>
                      <div className="preview-item">
                        <label>Severity</label>
                        <span className={`severity-badge severity-${formData.severity?.toLowerCase()}`}>
                          {formData.severity}
                        </span>
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="preview-tips">
                      <h4>💡 Tips</h4>
                      <ul>
                        <li>Be specific about the issue you're experiencing</li>
                        <li>Include any error messages</li>
                        <li>Attach screenshots if helpful</li>
                        <li>Our team typically responds within {getPreviewData().estimatedResponse}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SLIDING SIDEBAR FOR TICKET DETAILS */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>
      <div className={`ticket-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {selectedIncident && (
          <>
            <div className="sidebar-header-section">
              <div className="sidebar-header-top">
                <span className="sidebar-ticket-id">{selectedIncident.request_id || `TKT-${selectedIncident.id}`}</span>
                <button className="sidebar-close" onClick={closeSidebar}>✕</button>
              </div>
              <h2 className="sidebar-ticket-title">{selectedIncident.subject}</h2>
              
              <div className="sidebar-status-row">
                <span className={`status-chip-large status-${selectedIncident.status?.toLowerCase().replace("_", "-")}`}>
                  {selectedIncident.status?.replace("_", " ") || "OPEN"}
                </span>
                <span className={`priority-badge priority-${selectedIncident.priority?.toLowerCase()}`}>
                  {selectedIncident.priority}
                </span>
              </div>
            </div>

            {/* Sidebar Tabs */}
            <div className="sidebar-tabs">
              <button 
                className={`sidebar-tab ${activeDetailTab === "details" ? "active" : ""}`}
                onClick={() => setActiveDetailTab("details")}
              >
                Details
              </button>
              <button 
                className={`sidebar-tab ${activeDetailTab === "conversation" ? "active" : ""}`}
                onClick={() => setActiveDetailTab("conversation")}
              >
                Conversation
              </button>
              <button 
                className={`sidebar-tab ${activeDetailTab === "rating" ? "active" : ""}`}
                onClick={() => setActiveDetailTab("rating")}
              >
                Rating
              </button>
            </div>

            <div className="sidebar-content">
              {/* DETAILS TAB */}
              {activeDetailTab === "details" && (
                <div className="sidebar-details">
                  <div className="detail-section">
                    <label>Description</label>
                    <p>{selectedIncident.description || "No description provided."}</p>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Category</label>
                      <span>{selectedIncident.request_type || "INCIDENT"}</span>
                    </div>
                    <div className="detail-item">
                      <label>Severity</label>
                      <span className={`severity-badge severity-${selectedIncident.severity?.toLowerCase()}`}>
                        {selectedIncident.severity || "MEDIUM"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Created</label>
                      <span>{formatDate(selectedIncident.created_at)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Last Updated</label>
                      <span>{formatDate(selectedIncident.updated_at)}</span>
                    </div>
                    <div className="detail-item full-width">
                      <label>Assigned To</label>
                      <span>{selectedIncident.assignee_email || "Unassigned"}</span>
                    </div>
                  </div>

                  {/* SLA Timer */}
                  {slaCountdown[selectedIncident.id] && (
                    <div className={`sla-timer-large ${slaCountdown[selectedIncident.id].breached ? 'breached' : ''}`}>
                      <div className="sla-icon">{slaCountdown[selectedIncident.id].breached ? '⚠️' : '⏱️'}</div>
                      <div className="sla-info">
                        <label>SLA Status</label>
                        <span>{slaCountdown[selectedIncident.id].time}</span>
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {attachments.length > 0 && (
                    <div className="attachments-section">
                      <label>Attachments</label>
                      <div className="attachment-list">
                        {attachments.map((file, idx) => (
                          <a 
                            key={idx} 
                            className="attachment-item"
                            href={`http://localhost:5000/api/incidents/attachments/${file.id}/download`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="file-icon">📎</span>
                            <span className="file-name">{file.file_name || file.filename}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="sidebar-actions">
                    <button className="btn-edit" onClick={() => startEdit(selectedIncident)}>
                      ✏️ Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(selectedIncident.id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}

              {/* CONVERSATION TAB */}
              {activeDetailTab === "conversation" && (
                <div className="sidebar-conversation">
                  {selectedIncident.assignee_email ? (
                    <div className="chat-container">
                      <Chat 
                        incident={selectedIncident} 
                        currentUser={userName}
                        onClose={() => {}}
                      />
                    </div>
                  ) : (
                    <div className="no-assignee">
                      <span className="no-assignee-icon">👤</span>
                      <p>This ticket hasn't been assigned yet.</p>
                      <p className="hint">You'll be able to chat with the developer once assigned.</p>
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="add-comment">
                    <textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button 
                      className="btn-send-comment"
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* RATING TAB */}
              {activeDetailTab === "rating" && (
                <div className="sidebar-rating">
                  {ratingSubmitted ? (
                    <div className="rating-submitted">
                      <span className="rating-icon">⭐</span>
                      <h3>Thank you!</h3>
                      <p>Your feedback has been submitted.</p>
                    </div>
                  ) : (
                    <>
                      <h3>Rate this ticket</h3>
                      <p>How satisfied are you with the resolution?</p>
                      
                      <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className={`star-btn ${rating >= star ? 'active' : ''}`}
                            onClick={() => setRating(star)}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                      
                      <button 
                        className="btn-submit-rating"
                        onClick={handleSubmitRating}
                        disabled={rating === 0}
                      >
                        Submit Rating
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
