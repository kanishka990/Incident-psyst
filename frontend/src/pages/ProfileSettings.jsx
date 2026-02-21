import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [tickets, setTickets] = useState([]);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });
  
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    updates: true,
    resolved: true,
    promotional: false
  });

  // Get user info from localStorage
  const storedUser = localStorage.getItem("user") || "User";
  const storedRole = localStorage.getItem("role") || "customer";

  useEffect(() => {
    loadProfile();
    loadUserTickets();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login/customer");
        return;
      }

      // Try to load from API, fallback to localStorage
      try {
        const res = await api.get("/auth/profile");
        setProfile({
          name: res.data.name || storedUser,
          email: res.data.email || "",
          phone: res.data.phone || "",
          company: res.data.company || ""
        });
      } catch (err) {
        // Use localStorage data
        setProfile({
          name: storedUser,
          email: localStorage.getItem("user") || "",
          phone: "",
          company: ""
        });
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadUserTickets = async () => {
    try {
      const res = await api.get("/incidents");
      setTickets(res.data || []);
    } catch (err) {
      console.log("Could not load tickets");
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await api.put("/auth/profile", {
        name: profile.name,
        phone: profile.phone,
        company: profile.company
      });
      
      localStorage.setItem("userName", profile.name);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      // Save locally anyway
      localStorage.setItem("userName", profile.name);
      setSuccess("Profile saved locally!");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSaving(true);

    try {
      await api.put("/auth/profile", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      
      setSuccess("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'OPEN': return 'open';
      case 'IN_PROGRESS': return 'in-progress';
      case 'RESOLVED': return 'resolved';
      default: return 'open';
    }
  };

  if (loading) {
    return <div className="auth-page"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="auth-page">
      <div className="profile-container">
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
          <h1>⚙️ Profile Settings</h1>
        </div>

        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            🎫 My Tickets
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔐 Security
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <div className="profile-sections">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>📋 Personal Information</h2>
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profile.email || storedUser}
                    disabled
                    className="disabled-input"
                  />
                  <small>Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={profile.company}
                    onChange={handleProfileChange}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="form-group">
                  <label>Account Type</label>
                  <input
                    type="text"
                    value={storedRole === 'developer' ? 'Developer / Staff' : 'Customer'}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <button type="submit" className="main-btn" disabled={saving}>
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* My Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="profile-section">
              <h2>🎫 My Tickets</h2>
              
              {/* Ticket Stats */}
              <div className="ticket-stats">
                <div className="ticket-stat-card">
                  <h3>{tickets.length}</h3>
                  <p>Total Tickets</p>
                </div>
                <div className="ticket-stat-card">
                  <h3>{tickets.filter(t => t.status === 'OPEN').length}</h3>
                  <p>Open</p>
                </div>
                <div className="ticket-stat-card">
                  <h3>{tickets.filter(t => t.status === 'IN_PROGRESS').length}</h3>
                  <p>In Progress</p>
                </div>
                <div className="ticket-stat-card">
                  <h3>{tickets.filter(t => t.status === 'RESOLVED').length}</h3>
                  <p>Resolved</p>
                </div>
              </div>

              {/* Ticket List */}
              <div className="ticket-list">
                {tickets.length === 0 ? (
                  <div className="empty-state">
                    <p>No tickets found</p>
                  </div>
                ) : (
                  tickets.slice(0, 10).map((ticket) => (
                    <div key={ticket.id} className="ticket-item">
                      <div className="ticket-item-info">
                        <h4>#{ticket.id} - {ticket.title}</h4>
                        <p>{ticket.description?.substring(0, 60)}...</p>
                      </div>
                      <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="profile-section">
              <h2>🔔 Notification Preferences</h2>
              
              <div className="notification-options">
                <div className="notification-option">
                  <label>
                    Email Notifications
                    <span>Receive updates about your tickets via email</span>
                  </label>
                  <label className="notification-toggle">
                    <input 
                      type="checkbox" 
                      checked={notifications.email}
                      onChange={() => handleNotificationChange('email')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-option">
                  <label>
                    Status Updates
                    <span>Get notified when ticket status changes</span>
                  </label>
                  <label className="notification-toggle">
                    <input 
                      type="checkbox" 
                      checked={notifications.updates}
                      onChange={() => handleNotificationChange('updates')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-option">
                  <label>
                    Resolution Alerts
                    <span>Be notified when issues are resolved</span>
                  </label>
                  <label className="notification-toggle">
                    <input 
                      type="checkbox" 
                      checked={notifications.resolved}
                      onChange={() => handleNotificationChange('resolved')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-option">
                  <label>
                    Promotional Emails
                    <span>Receive news and promotional content</span>
                  </label>
                  <label className="notification-toggle">
                    <input 
                      type="checkbox" 
                      checked={notifications.promotional}
                      onChange={() => handleNotificationChange('promotional')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <button className="main-btn" style={{ marginTop: '20px' }}>
                💾 Save Preferences
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="profile-section">
              <h2>🔐 Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="profile-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                </div>

                <button type="submit" className="main-btn" disabled={saving}>
                  {saving ? "Changing..." : "🔒 Change Password"}
                </button>
              </form>

              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #f1f5f9' }}>
                <h3>🚪 Sign Out</h3>
                <p style={{ color: '#64748b', marginBottom: '15px' }}>
                  Sign out from your account on this device
                </p>
                <button 
                  className="main-btn" 
                  style={{ background: '#dc2626' }}
                  onClick={() => {
                    localStorage.clear();
                    navigate('/login/customer');
                  }}
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
