import { useState, useEffect } from "react";
import api from "../services/api";

export default function Notifications({ onClose, onNotificationClick }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification");
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'status_change': return '🔄';
      case 'new_comment': return '💬';
      case 'new_reply': return '↩️';
      default: return '📢';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="notifications-dropdown">
      <div className="notifications-header">
        <h3>🔔 Notifications</h3>
        {unreadCount > 0 && (
          <button className="mark-all-btn" onClick={markAllAsRead}>
            Mark all read
          </button>
        )}
      </div>

      <div className="notifications-list">
        {loading ? (
          <div className="notifications-loading">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="notifications-empty">
            No notifications
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id}
              className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
              onClick={() => {
                markAsRead(notification.id);
                if (onNotificationClick) {
                  onNotificationClick(notification);
                }
              }}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">
                  {formatDate(notification.created_at)}
                </div>
              </div>
              <button 
                className="notification-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
