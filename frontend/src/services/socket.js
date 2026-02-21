import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("join", userId);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const joinIncidentRoom = (incidentId) => {
  socket.emit("join_incident", incidentId);
};

export const leaveIncidentRoom = (incidentId) => {
  socket.emit("leave_incident", incidentId);
};

export const sendChatMessage = (data) => {
  socket.emit("send_message", data);
};

export const markMessagesAsRead = (incidentId, userId) => {
  socket.emit("mark_read", { incidentId, userId });
};

export const onNewMessage = (callback) => {
  socket.on("new_message", callback);
};

export const onUnreadUpdate = (callback) => {
  socket.on("unread_update", callback);
};

export const onMessagesRead = (callback) => {
  socket.on("messages_read", callback);
};

export const removeNewMessageListener = () => {
  socket.off("new_message");
};

export const removeUnreadUpdateListener = () => {
  socket.off("unread_update");
};

export const removeMessagesReadListener = () => {
  socket.off("messages_read");
};
