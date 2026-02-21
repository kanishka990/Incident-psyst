import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token
const getAuthToken = () => localStorage.getItem('token');

// Create axios instance with auth header
const axiosWithAuth = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

// Get all connected apps
export const getConnectedApps = async () => {
  try {
    const response = await axiosWithAuth().get('/apps');
    return response.data;
  } catch (error) {
    console.error('Error fetching connected apps:', error);
    throw error;
  }
};

// Connect an app (initiates OAuth flow)
export const connectApp = async (appId) => {
  try {
    const response = await axiosWithAuth().post(`/apps/connect/${appId}`);
    return response.data;
  } catch (error) {
    console.error('Error connecting app:', error);
    throw error;
  }
};

// Disconnect an app
export const disconnectApp = async (appId) => {
  try {
    const response = await axiosWithAuth().delete(`/apps/disconnect/${appId}`);
    return response.data;
  } catch (error) {
    console.error('Error disconnecting app:', error);
    throw error;
  }
};

// Get app activity
export const getAppActivity = async (appId) => {
  try {
    const response = await axiosWithAuth().get(`/apps/activity/${appId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching app activity:', error);
    throw error;
  }
};

// AI Chat
export const aiChat = async (message, context = {}) => {
  try {
    const response = await axiosWithAuth().post('/apps/ai/chat', { message, context });
    return response.data;
  } catch (error) {
    console.error('Error in AI chat:', error);
    throw error;
  }
};

// AI Generate Image
export const aiGenerateImage = async (prompt) => {
  try {
    const response = await axiosWithAuth().post('/apps/ai/generate-image', { prompt });
    return response.data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export default {
  getConnectedApps,
  connectApp,
  disconnectApp,
  getAppActivity,
  aiChat,
  aiGenerateImage
};
