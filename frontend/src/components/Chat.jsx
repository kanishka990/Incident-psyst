import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import {
  connectSocket,
  disconnectSocket,
  joinIncidentRoom,
  leaveIncidentRoom,
  sendChatMessage,
  markMessagesAsRead,
  onNewMessage,
  onUnreadUpdate,
  removeNewMessageListener,
  removeUnreadUpdateListener,
} from "../services/socket";
import "./Chat.css";

export default function Chat({ incident, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const userId = parseInt(localStorage.getItem("userId"));
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("role") || "customer";

  // Determine the receiver based on current user role and incident
  const getReceiver = () => {
    if (userRole === "customer") {
      return {
        receiver_id: incident.assignee_id || incident.developer_id,
        receiver_name: incident.assignee_name || incident.developer_name || "Developer",
      };
    } else {
      return {
        receiver_id: incident.user_id,
        receiver_name: incident.user_name || incident.reporter_name || "Customer",
      };
    }
  };

  // Load existing messages
  const loadMessages = async () => {
    try {
      const res = await api.get(`/chat/${incident.id}`);
      setMessages(res.data || []);
      
      // Mark messages as read
      await api.put(`/chat/${incident.id}/read`);
      markMessagesAsRead(incident.id, userId);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize socket connection
  useEffect(() => {
    connectSocket(userId);
    joinIncidentRoom(incident.id);
    loadMessages();

    // Listen for new messages
    onNewMessage((message) => {
      if (message.incident_id === incident.id) {
        setMessages((prev) => [...prev, message]);
        // Mark as read if we're the receiver
        if (message.receiver_id === userId) {
          api.put(`/chat/${incident.id}/read`);
          markMessagesAsRead(incident.id, userId);
        }
      }
    });

    // Listen for unread updates
    onUnreadUpdate(({ incidentId }) => {
      if (incidentId === incident.id) {
        loadMessages();
      }
    });

    return () => {
      leaveIncidentRoom(incident.id);
      removeNewMessageListener();
      removeUnreadUpdateListener();
    };
  }, [incident.id, userId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const receiver = getReceiver();

    const messageData = {
      incidentId: incident.id,
      senderId: userId,
      senderName: userName,
      senderRole: userRole,
      receiverId: receiver.receiver_id,
      receiverName: receiver.receiver_name,
      message: newMessage.trim(),
    };

    try {
      // Send via socket (will be saved and broadcast)
      sendChatMessage(messageData);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = "";

    messages.forEach((msg) => {
      const msgDate = formatDate(msg.created_at);
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ type: "date", date: msgDate });
      }
      groups.push({ type: "message", ...msg });
    });

    return groups;
  };

  const receiver = getReceiver();

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">
            {receiver.receiver_name.charAt(0).toUpperCase()}
          </div>
          <div className="chat-header-text">
            <h4>Chat with {receiver.receiver_name}</h4>
            <span className="chat-status">Online</span>
          </div>
        </div>
        <button className="chat-close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="chat-messages">
        {loading ? (
          <div className="chat-loading">
            <div className="spinner"></div>
            <span>Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>No messages yet</p>
            <span>Start a conversation about this incident</span>
          </div>
        ) : (
          groupMessagesByDate().map((item, index) => {
            if (item.type === "date") {
              return (
                <div key={`date-${index}`} className="chat-date-divider">
                  <span>{item.date}</span>
                </div>
              );
            }
            const isOwnMessage = item.sender_id === userId;
            return (
              <div
                key={item.id || index}
                className={`chat-message ${isOwnMessage ? "own" : "other"}`}
              >
                <div className="message-bubble">
                  <p>{item.message}</p>
                  <span className="message-time">{formatTime(item.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!newMessage.trim() || sending}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}
