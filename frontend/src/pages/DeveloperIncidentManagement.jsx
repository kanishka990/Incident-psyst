import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import api from "../services/api";
import Chat from "../components/Chat";
import "./DeveloperIncidentManagement.css";

export default function DeveloperIncidentManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dragItem = useRef();
  const dragOverItem = useRef();

  // ===============================
  // STATE MANAGEMENT
  // ===============================
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // View Types: list, board, analytics
  const [currentView, setCurrentView] = useState("dashboard");
  
  // Filters
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    status: "",
    severity: "",
    search: "",
    dateFrom: "",
    dateTo: "",
    assignee: "",
    requestType: "",
    priority: ""
  });
  
  // Bulk selection
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Sliding Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("details");
  
  // Activity Timeline
  const [activities, setActivities] = useState([]);
  
  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Global Search
  const [searchQuery, setSearchQuery] = useState("");

  // Notes & Worklog
  const [newNote, setNewNote] = useState("");
  const [newReply, setNewReply] = useState("");

  // SLA Timer
  const [slaCountdown, setSlaCountdown] = useState({});

  // Custom Statuses (Kanban columns)
  const kanbanColumns = [
    { id: "BACKLOG", name: "Backlog", color: "#94a3b8" },
    { id: "TODO", name: "To Do", color: "#64748b" },
    { id: "OPEN", name: "Open", color: "#3b82f6" },
    { id: "IN_PROGRESS", name: "In Progress", color: "#f59e0b" },
    { id: "TESTING", name: "Testing", color: "#8b5cf6" },
    { id: "RESOLVED", name: "Resolved", color: "#10b981" },
    { id: "CLOSED", name: "Closed", color: "#22c55e" }
  ];

  // Priority Options
  const priorities = [
    { id: "P1", name: "P1 - Critical", color: "#dc2626" },
    { id: "P2", name: "P2 - High", color: "#f97316" },
    { id: "P3", name: "P3 - Medium", color: "#eab308" },
    { id: "P4", name: "P4 - Low", color: "#22c55e" }
  ];

  // Departments/Spaces
  const spaces = [
    { id: "all", name: "All Tickets", icon: "🎫", color: "#6366f1" },
    { id: "IT", name: "IT Support", icon: "💻", color: "#8b5cf6" },
    { id: "HR", name: "HR Requests", icon: "👥", color: "#ec4899" },
    { id: "Operations", name: "Operations", icon: "⚙️", color: "#f59e0b" },
    { id: "Facilities", name: "Facilities", icon: "🏢", color: "#10b981" }
  ];

  const [currentSpace, setCurrentSpace] = useState("all");

  const currentUser = localStorage.getItem("user");
  const currentUserEmail = localStorage.getItem("userEmail") || currentUser;

  // ===============================
  // DATA LOADING
  // ===============================
  useEffect(() => {
    loadIncidents();
    loadUsers();
    loadNotifications();
  }, [activeTab, filters, currentSpace]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const params = {
        status: filters.status || undefined,
        severity: filters.severity || undefined,
        search: filters.search || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        assignee: filters.assignee || undefined,
        requestType: filters.requestType || undefined,
      };
      
      const res = await api.get("/incidents", { params });
      let data = res.data || [];
      
      // Filter by tab
      if (activeTab === "unassigned") {
        data = data.filter(i => !i.assigned_to);
      } else if (activeTab === "myTickets") {
        data = data.filter(i => i.assigned_to === currentUserEmail);
      }
      
      setIncidents(data);
    } catch (err) {
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      setNotifications([]);
    }
  };

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
              time: `${hours}h ${minutes}m` 
            };
          }
        }
      });
      setSlaCountdown(newCountdown);
    }, 60000);

    return () => clearInterval(interval);
  }, [incidents]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login/developer", { replace: true });
  };

  // ===============================
  // DRAG AND DROP
  // ===============================
  const handleDragStart = (e, incident) => {
    dragItem.current = incident;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, incident) => {
    dragOverItem.current = incident;
  };

  const handleDragEnd = async () => {
    if (!dragItem.current || !dragOverItem.current) return;
    if (dragItem.current.id === dragOverItem.current.id) return;
    if (dragItem.current.status === dragOverItem.current.status) return;

    const newStatus = dragOverItem.current.status;
    
    try {
      await api.put(`/incidents/${dragItem.current.id}`, { status: newStatus });
      
      setIncidents(incidents.map(i => 
        i.id === dragItem.current.id ? { ...i, status: newStatus } : i
      ));
      
      // Add activity
      addActivity(dragItem.current.id, `Status changed to ${newStatus}`);
    } catch (err) {
      setError("Failed to update status");
    }
    
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // ===============================
  // ACTIVITY LOG
  // ===============================
  const addActivity = (incidentId, action) => {
    const newActivity = {
      id: Date.now(),
      incidentId,
      action,
      user: currentUser,
      timestamp: new Date().toISOString()
    };
    setActivities([newActivity, ...activities]);
  };

  // ===============================
  // BULK ACTIONS
  // ===============================
  const toggleSelectAll = () => {
    if (selectedTickets.length === filteredIncidents.length) {
      setSelectedTickets([]);
      setShowBulkActions(false);
    } else {
      setSelectedTickets(filteredIncidents.map(i => i.id));
      setShowBulkActions(true);
    }
  };

  const toggleSelect = (id) => {
    if (selectedTickets.includes(id)) {
      setSelectedTickets(selectedTickets.filter(t => t !== id));
      if (selectedTickets.length === 1) setShowBulkActions(false);
    } else {
      setSelectedTickets([...selectedTickets, id]);
      setShowBulkActions(true);
    }
  };

  const handleBulkStatusChange = async (status) => {
    try {
      await Promise.all(selectedTickets.map(id => 
        api.put(`/incidents/${id}`, { status })
      ));
      setSelectedTickets([]);
      setShowBulkActions(false);
      loadIncidents();
    } catch (err) {
      setError("Bulk update failed");
    }
  };

  const handleBulkAssign = async (userId) => {
    try {
      await Promise.all(selectedTickets.map(id => 
        api.put(`/incidents/${id}`, { assigned_to: userId })
      ));
      setSelectedTickets([]);
      setShowBulkActions(false);
      loadIncidents();
    } catch (err) {
      setError("Bulk assign failed");
    }
  };

  const handleBulkPriorityChange = async (priority) => {
    try {
      await Promise.all(selectedTickets.map(id => 
        api.put(`/incidents/${id}`, { severity: priority })
      ));
      setSelectedTickets([]);
      setShowBulkActions(false);
      loadIncidents();
    } catch (err) {
      setError("Bulk priority update failed");
    }
  };

  // ===============================
  // TICKET DETAILS - SLIDING SIDEBAR
  // ===============================
  const openIncidentDetails = async (incident) => {
    setSelectedIncident(incident);
    setSidebarOpen(true);
    setActiveDetailTab("details");
    
    // Add view activity
    addActivity(incident.id, "Ticket opened");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedIncident(null);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await api.post(`/incidents/${selectedIncident.id}/notes`, {
        content: newNote,
        is_internal: true
      });
      setNewNote("");
      const res = await api.get(`/incidents/${selectedIncident.id}`);
      setSelectedIncident(res.data);
      addActivity(selectedIncident.id, "Internal note added");
    } catch (err) {
      setError("Failed to add note");
    }
  };

  const handleAddReply = async () => {
    if (!newReply.trim()) return;
    try {
      await api.post(`/incidents/${selectedIncident.id}/comments`, {
        content: newReply,
        is_internal: false
      });
      setNewReply("");
      const res = await api.get(`/incidents/${selectedIncident.id}`);
      setSelectedIncident(res.data);
      addActivity(selectedIncident.id, "Reply added");
    } catch (err) {
      setError("Failed to add reply");
    }
  };

  // ===============================
  // QUICK ACTIONS
  // ===============================
  const quickStatusChange = async (id, status) => {
    try {
      await api.put(`/incidents/${id}`, { status });
      setIncidents(incidents.map(i => i.id === id ? { ...i, status } : i));
      addActivity(id, `Status changed to ${status}`);
    } catch (err) {
      setError("Status update failed");
    }
  };

  const quickAssign = async (id, userId) => {
    try {
      await api.put(`/incidents/${id}`, { assigned_to: userId });
      setIncidents(incidents.map(i => i.id === id ? { ...i, assigned_to: userId } : i));
      addActivity(id, `Assigned to ${userId}`);
    } catch (err) {
      setError("Assign failed");
    }
  };

  const quickPriorityChange = async (id, priority) => {
    try {
      await api.put(`/incidents/${id}`, { severity: priority });
      setIncidents(incidents.map(i => i.id === id ? { ...i, severity: priority } : i));
      addActivity(id, `Priority changed to ${priority}`);
    } catch (err) {
      setError("Priority update failed");
    }
  };

  // ===============================
  // SLA HELPERS
  // ===============================
  const getSLAStatus = (incident) => {
    if (!incident.created_at) return "ok";
    const created = new Date(incident.created_at);
    const now = new Date();
    const hoursDiff = (now - created) / (1000 * 60 * 60);
    
    const severity = incident.severity;
    let slaHours = 24;
    if (severity === "URGENT" || severity === "CRITICAL") slaHours = 1;
    else if (severity === "HIGH") slaHours = 4;
    else if (severity === "MEDIUM") slaHours = 8;

    if (hoursDiff >= slaHours) return "breached";
    if (hoursDiff >= slaHours * 0.8) return "warning";
    return "ok";
  };

  const getSLAHours = (severity) => {
    switch(severity) {
      case "URGENT": case "CRITICAL": return 1;
      case "HIGH": return 4;
      case "MEDIUM": return 8;
      default: return 24;
    }
  };

  // ===============================
  // FILTERED DATA
  // ===============================
  const filteredIncidents = useMemo(() => {
    let filtered = incidents;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(i => 
        i.title?.toLowerCase().includes(query) || 
        i.subject?.toLowerCase().includes(query) ||
        i.description?.toLowerCase().includes(query) ||
        i.id?.toString().includes(query)
      );
    }
    
    // Space filter
    if (currentSpace !== "all") {
      filtered = filtered.filter(i => {
        const spaceType = i.request_type?.toUpperCase();
        if (currentSpace === "IT") return ["IT", "INCIDENT", "TECHNICAL"].includes(spaceType);
        if (currentSpace === "HR") return ["HR", "LEAVE", "BENEFITS"].includes(spaceType);
        if (currentSpace === "Operations") return ["OPERATIONS", "PROCESS"].includes(spaceType);
        if (currentSpace === "Facilities") return ["FACILITIES", "MAINTENANCE"].includes(spaceType);
        return true;
      });
    }
    
    return filtered;
  }, [incidents, searchQuery, currentSpace]);

  // ===============================
  // STATISTICS
  // ===============================
  const stats = useMemo(() => {
    const myTickets = filteredIncidents.filter(i => i.assigned_to === currentUserEmail);
    return {
      totalAssigned: myTickets.length,
      criticalIssues: myTickets.filter(i => i.severity === "CRITICAL" || i.priority === "P1").length,
      slaBreachRisk: myTickets.filter(i => getSLAStatus(i) === "warning" || getSLAStatus(i) === "breached").length,
      todayCompleted: myTickets.filter(i => {
        if (i.status === "RESOLVED" || i.status === "CLOSED") {
          const updated = new Date(i.updated_at);
          const today = new Date();
          return updated.toDateString() === today.toDateString();
        }
        return false;
      }).length,
      total: filteredIncidents.length,
      open: filteredIncidents.filter(i => i.status === "OPEN" || i.status === "TODO" || i.status === "BACKLOG").length,
      inProgress: filteredIncidents.filter(i => i.status === "IN_PROGRESS").length,
      resolved: filteredIncidents.filter(i => i.status === "RESOLVED" || i.status === "CLOSED").length,
      unassigned: filteredIncidents.filter(i => !i.assigned_to).length
    };
  }, [filteredIncidents, currentUserEmail]);

  // Analytics data
  const analyticsData = useMemo(() => {
    // Status distribution
    const statusDist = {};
    kanbanColumns.forEach(col => {
      statusDist[col.name] = filteredIncidents.filter(i => i.status === col.id).length;
    });
    
    // Priority distribution
    const priorityDist = {
      "P1 - Critical": filteredIncidents.filter(i => i.priority === "P1" || i.severity === "CRITICAL").length,
      "P2 - High": filteredIncidents.filter(i => i.priority === "P2" || i.severity === "HIGH").length,
      "P3 - Medium": filteredIncidents.filter(i => i.priority === "P3" || i.severity === "MEDIUM").length,
      "P4 - Low": filteredIncidents.filter(i => i.priority === "P4" || i.severity === "LOW").length
    };
    
    // Weekly trend (last 7 days)
    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const created = filteredIncidents.filter(inc => inc.created_at?.startsWith(dateStr)).length;
      const resolved = filteredIncidents.filter(inc => 
        (inc.status === "RESOLVED" || inc.status === "CLOSED") && 
        inc.updated_at?.startsWith(dateStr)
      ).length;
      weeklyTrend.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        created,
        resolved
      });
    }
    
    return { statusDist, priorityDist, weeklyTrend };
  }, [filteredIncidents]);

  // ===============================
  // KANBAN HELPERS
  // ===============================
  const getIncidentsByStatus = (status) => {
    return filteredIncidents.filter(i => i.status === status);
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A";

  // ===============================
  // RENDER VIEWS
  // ===============================
  const renderDashboard = () => (
    <div className="dev-dashboard">
      {/* Stats Cards */}
      <div className="dev-stats-grid">
        <div className="dev-stat-card">
          <div className="dev-stat-icon" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)' }}>📋</div>
          <div className="dev-stat-content">
            <span className="dev-stat-number">{stats.totalAssigned}</span>
            <span className="dev-stat-label">My Tickets</span>
          </div>
        </div>
        
        <div className="dev-stat-card">
          <div className="dev-stat-icon" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' }}>🚨</div>
          <div className="dev-stat-content">
            <span className="dev-stat-number stat-danger">{stats.criticalIssues}</span>
            <span className="dev-stat-label">Critical Issues</span>
          </div>
        </div>
        
        <div className="dev-stat-card">
          <div className="dev-stat-icon" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>⚠️</div>
          <div className="dev-stat-content">
            <span className="dev-stat-number stat-warning">{stats.slaBreachRisk}</span>
            <span className="dev-stat-label">SLA Risk</span>
          </div>
        </div>
        
        <div className="dev-stat-card">
          <div className="dev-stat-icon" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>✅</div>
          <div className="dev-stat-content">
            <span className="dev-stat-number stat-success">{stats.todayCompleted}</span>
            <span className="dev-stat-label">Today Completed</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dev-quick-actions">
        <button className="dev-quick-btn" onClick={() => setCurrentView("board")}>
          <span className="dev-quick-icon">📊</span>
          <span>Kanban Board</span>
        </button>
        <button className="dev-quick-btn" onClick={() => setCurrentView("list")}>
          <span className="dev-quick-icon">📋</span>
          <span>List View</span>
        </button>
        <button className="dev-quick-btn" onClick={() => setCurrentView("analytics")}>
          <span className="dev-quick-icon">📈</span>
          <span>Analytics</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="dev-activity-section">
        <h3>Recent Activity</h3>
        <div className="dev-activity-list">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="dev-activity-item">
              <span className="activity-icon">📝</span>
              <div className="activity-content">
                <span className="activity-action">{activity.action}</span>
                <span className="activity-meta">{activity.user} • {formatDate(activity.timestamp)}</span>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="dev-activity-empty">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderKanbanView = () => (
    <div className="kanban-board">
      {kanbanColumns.slice(0, 6).map(status => (
        <div 
          key={status.id} 
          className="kanban-column"
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="kanban-column-header" style={{ borderTopColor: status.color }}>
            <span className="kanban-column-title">{status.name}</span>
            <span className="kanban-column-count">{getIncidentsByStatus(status.id).length}</span>
          </div>
          <div className="kanban-column-content">
            {getIncidentsByStatus(status.id).map(incident => (
              <div 
                key={incident.id}
                className={`kanban-card ${selectedTickets.includes(incident.id) ? 'selected' : ''} ${getSLAStatus(incident) === 'breached' ? 'sla-breached' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, incident)}
                onDragEnter={(e) => handleDragEnter(e, incident)}
                onDragEnd={handleDragEnd}
                onClick={() => openIncidentDetails(incident)}
              >
                <div className="kanban-card-header">
                  <span className="kanban-card-id">#{incident.id}</span>
                  <input 
                    type="checkbox" 
                    checked={selectedTickets.includes(incident.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelect(incident.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="kanban-card-title">{incident.title || incident.subject}</div>
                <div className="kanban-card-footer">
                  <span className={`priority-dot priority-${incident.priority?.toLowerCase() || 'p3'}`}></span>
                  <span className="kanban-card-assignee">
                    {incident.assigned_to ? incident.assigned_to.split('@')[0] : 'Unassigned'}
                  </span>
                </div>
                {slaCountdown[incident.id] && (
                  <div className={`kanban-sla ${slaCountdown[incident.id].breached ? 'breached' : ''}`}>
                    {slaCountdown[incident.id].breached ? '⚠️' : '⏱️'} {slaCountdown[incident.id].time}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="tickets-table-container">
      <table className="tickets-table">
        <thead>
          <tr>
            <th className="col-checkbox">
              <input
                type="checkbox"
                checked={selectedTickets.length === filteredIncidents.length && filteredIncidents.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="col-id">ID</th>
            <th className="col-subject">Subject</th>
            <th className="col-status">Status</th>
            <th className="col-priority">Priority</th>
            <th className="col-assignee">Assignee</th>
            <th className="col-sla">SLA</th>
            <th className="col-updated">Updated</th>
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="9" className="loading-cell">Loading...</td></tr>
          ) : filteredIncidents.length === 0 ? (
            <tr><td colSpan="9" className="empty-cell">No tickets found</td></tr>
          ) : (
            filteredIncidents.map(incident => {
              const slaStatus = getSLAStatus(incident);
              return (
                <tr key={incident.id} className={slaStatus === "breached" ? "sla-breached" : ""}>
                  <td className="col-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(incident.id)}
                      onChange={() => toggleSelect(incident.id)}
                    />
                  </td>
                  <td className="col-id">
                    <span className="ticket-id-link" onClick={() => openIncidentDetails(incident)}>
                      #{incident.id}
                    </span>
                  </td>
                  <td className="col-subject">
                    <span className="ticket-subject" onClick={() => openIncidentDetails(incident)}>
                      {incident.title || incident.subject || "No title"}
                    </span>
                  </td>
                  <td className="col-status">
                    <select
                      value={incident.status}
                      onChange={(e) => quickStatusChange(incident.id, e.target.value)}
                      className="status-select"
                    >
                      {kanbanColumns.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="col-priority">
                    <select
                      value={incident.priority || incident.severity}
                      onChange={(e) => quickPriorityChange(incident.id, e.target.value)}
                      className="priority-select"
                    >
                      {priorities.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="col-assignee">
                    <select
                      value={incident.assigned_to || ""}
                      onChange={(e) => quickAssign(incident.id, e.target.value)}
                      className="assignee-select"
                    >
                      <option value="">Unassigned</option>
                      {users.map(u => (
                        <option key={u.id} value={u.email}>{u.name || u.email}</option>
                      ))}
                    </select>
                  </td>
                  <td className="col-sla">
                    <span className={`sla-badge sla-${slaStatus}`}>
                      {slaStatus === "breached" ? "Breached" : 
                       slaStatus === "warning" ? "Warning" : 
                       `${getSLAHours(incident.severity)}h`}
                    </span>
                  </td>
                  <td className="col-updated">
                    {incident.updated_at ? formatDate(incident.updated_at) : "-"}
                  </td>
                  <td className="col-actions">
                    <button className="action-btn" onClick={() => openIncidentDetails(incident)}>👁️</button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="analytics-view">
      <div className="analytics-grid">
        {/* Status Distribution */}
        <div className="analytics-card">
          <h3>Status Distribution</h3>
          <div className="chart-container">
            {Object.entries(analyticsData.statusDist).map(([status, count]) => (
              <div key={status} className="chart-bar-row">
                <span className="chart-label">{status}</span>
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar" 
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="chart-value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="analytics-card">
          <h3>Priority Distribution</h3>
          <div className="chart-container">
            {Object.entries(analyticsData.priorityDist).map(([priority, count]) => (
              <div key={priority} className="chart-bar-row">
                <span className="chart-label">{priority}</span>
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar priority-bar" 
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="chart-value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="analytics-card full-width">
          <h3>Weekly Trend</h3>
          <div className="trend-chart">
            {analyticsData.weeklyTrend.map((day, i) => (
              <div key={i} className="trend-column">
                <div className="trend-bars">
                  <div 
                    className="trend-bar created"
                    style={{ height: `${Math.max(day.created * 10, 5)}%` }}
                    title={`Created: ${day.created}`}
                  ></div>
                  <div 
                    className="trend-bar resolved"
                    style={{ height: `${Math.max(day.resolved * 10, 5)}%` }}
                    title={`Resolved: ${day.resolved}`}
                  ></div>
                </div>
                <span className="trend-label">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="trend-legend">
            <span className="legend-item"><span className="legend-color created"></span> Created</span>
            <span className="legend-item"><span className="legend-color resolved"></span> Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="dev-container">
      {/* HEADER */}
      <header className="dev-header">
        <div className="dev-header-left">
          <div className="dev-logo">
            <span className="logo-icon">🛠️</span>
            <span className="logo-text">DevHub</span>
          </div>
          <span className="user-role-badge">Developer</span>
        </div>
        
        <div className="dev-header-center">
          {/* View Tabs */}
          <div className="view-tabs">
            <button 
              className={`view-tab ${currentView === "board" ? "active" : ""}`}
              onClick={() => setCurrentView("board")}
            >
              Board
            </button>
            <button 
              className={`view-tab ${currentView === "list" ? "active" : ""}`}
              onClick={() => setCurrentView("list")}
            >
              List
            </button>
            <button 
              className={`view-tab ${currentView === "analytics" ? "active" : ""}`}
              onClick={() => setCurrentView("analytics")}
            >
              Analytics
            </button>
          </div>
        </div>

        <div className="dev-header-right">
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

          {/* User Profile */}
          <button className="profile-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

      {/* ERROR BANNER */}
      {error && (
        <div className="error-banner" onClick={() => setError(null)}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* SPACES BAR */}
      <div className="spaces-bar">
        {spaces.map(space => (
          <button
            key={space.id}
            className={`space-btn ${currentSpace === space.id ? "active" : ""}`}
            onClick={() => setCurrentSpace(space.id)}
            style={{ '--space-color': space.color }}
          >
            <span className="space-icon">{space.icon}</span>
            <span className="space-name">{space.name}</span>
          </button>
        ))}
      </div>

      {/* FILTERS BAR */}
      <div className="filters-bar">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            {kanbanColumns.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          >
            <option value="">All Priorities</option>
            {priorities.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.assignee}
            onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
          >
            <option value="">All Assignees</option>
            {users.map(u => (
              <option key={u.id} value={u.email}>{u.name || u.email}</option>
            ))}
          </select>
        </div>

        <button 
          className="clear-filters-btn"
          onClick={() => setFilters({
            status: "", severity: "", search: "", dateFrom: "", dateTo: "", assignee: "", requestType: ""
          })}
        >
          Clear Filters
        </button>
      </div>

      {/* BULK ACTIONS BAR */}
      {showBulkActions && (
        <div className="bulk-actions-bar">
          <span>{selectedTickets.length} ticket(s) selected</span>
          <div className="bulk-buttons">
            <select onChange={(e) => handleBulkStatusChange(e.target.value)}>
              <option value="">Change Status</option>
              {kanbanColumns.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select onChange={(e) => handleBulkAssign(e.target.value)}>
              <option value="">Assign To</option>
              {users.map(u => (
                <option key={u.id} value={u.email}>{u.name || u.email}</option>
              ))}
            </select>
            <select onChange={(e) => handleBulkPriorityChange(e.target.value)}>
              <option value="">Set Priority</option>
              {priorities.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button className="cancel-btn" onClick={() => { setSelectedTickets([]); setShowBulkActions(false); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stat-item" onClick={() => setActiveTab("all")}>
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item" onClick={() => setActiveTab("myTickets")}>
          <span className="stat-value">{stats.totalAssigned}</span>
          <span className="stat-label">My Tickets</span>
        </div>
        <div className="stat-item">
          <span className="stat-value stat-warning">{stats.open}</span>
          <span className="stat-label">Open</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.inProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-item">
          <span className="stat-value stat-success">{stats.resolved}</span>
          <span className="stat-label">Resolved</span>
        </div>
        <div className="stat-item">
          <span className="stat-value stat-danger">{stats.slaBreachRisk}</span>
          <span className="stat-label">SLA Risk</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="dev-main">
        {currentView === "dashboard" && renderDashboard()}
        {currentView === "board" && renderKanbanView()}
        {currentView === "list" && renderListView()}
        {currentView === "analytics" && renderAnalyticsView()}
      </main>

      {/* SLIDING SIDEBAR FOR TICKET DETAILS */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>
      <div className={`ticket-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {selectedIncident && (
          <>
            <div className="sidebar-header-section">
              <div className="sidebar-header-top">
                <span className="sidebar-ticket-id">#{selectedIncident.id}</span>
                <button className="sidebar-close" onClick={closeSidebar}>✕</button>
              </div>
              <h2 className="sidebar-ticket-title">{selectedIncident.title || selectedIncident.subject}</h2>
              
              <div className="sidebar-status-row">
                <select
                  value={selectedIncident.status}
                  onChange={(e) => quickStatusChange(selectedIncident.id, e.target.value)}
                  className="status-select-large"
                >
                  {kanbanColumns.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <select
                  value={selectedIncident.priority || selectedIncident.severity}
                  onChange={(e) => quickPriorityChange(selectedIncident.id, e.target.value)}
                  className="priority-select-large"
                >
                  {priorities.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
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
                className={`sidebar-tab ${activeDetailTab === "activity" ? "active" : ""}`}
                onClick={() => setActiveDetailTab("activity")}
              >
                Activity
              </button>
              <button 
                className={`sidebar-tab ${activeDetailTab === "conversation" ? "active" : ""}`}
                onClick={() => setActiveDetailTab("conversation")}
              >
                Chat
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
                      <label>Type</label>
                      <span>{selectedIncident.request_type || "INCIDENT"}</span>
                    </div>
                    <div className="detail-item">
                      <label>Created</label>
                      <span>{formatDate(selectedIncident.created_at)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Updated</label>
                      <span>{formatDate(selectedIncident.updated_at)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Assignee</label>
                      <select
                        value={selectedIncident.assigned_to || ""}
                        onChange={(e) => quickAssign(selectedIncident.id, e.target.value)}
                        className="assignee-select"
                      >
                        <option value="">Unassigned</option>
                        {users.map(u => (
                          <option key={u.id} value={u.email}>{u.name || u.email}</option>
                        ))}
                      </select>
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

                  {/* Internal Notes */}
                  <div className="notes-section">
                    <label>Internal Notes</label>
                    <div className="add-note">
                      <textarea
                        placeholder="Add internal note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <button onClick={handleAddNote} disabled={!newNote.trim()}>Add Note</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVITY TAB */}
              {activeDetailTab === "activity" && (
                <div className="sidebar-activity">
                  <div className="activity-timeline">
                    {activities.filter(a => a.incidentId === selectedIncident.id).map((activity) => (
                      <div key={activity.id} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="timeline-action">{activity.action}</span>
                          <span className="timeline-meta">{activity.user} • {formatDate(activity.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                    {activities.filter(a => a.incidentId === selectedIncident.id).length === 0 && (
                      <div className="timeline-empty">No activity yet</div>
                    )}
                  </div>
                </div>
              )}

              {/* CONVERSATION TAB */}
              {activeDetailTab === "conversation" && (
                <div className="sidebar-conversation">
                  <div className="chat-container">
                    <Chat 
                      incident={selectedIncident} 
                      currentUser={currentUser}
                      onClose={() => {}}
                    />
                  </div>
                  <div className="add-comment">
                    <textarea
                      placeholder="Add a reply..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                    />
                    <button 
                      className="btn-send-comment"
                      onClick={handleAddReply}
                      disabled={!newReply.trim()}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
