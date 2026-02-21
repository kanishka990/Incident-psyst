import pool from '../config/db.js';
import OpenAI from 'openai';

// Get user's connected apps
export const getConnectedApps = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get connected apps from database
    const result = await pool.query(
      'SELECT * FROM user_connected_apps WHERE user_id = $1',
      [userId]
    );
    
    // Return all possible apps with their connection status
    const allApps = [
      { id: 'slack', name: 'Slack', icon: 'slack', color: '#4A154B' },
      { id: 'github', name: 'GitHub', icon: 'github', color: '#333' },
      { id: 'notion', name: 'Notion', icon: 'notion', color: '#000' },
      { id: 'gdrive', name: 'Google Drive', icon: 'gdrive', color: '#4285f4' },
      { id: 'gcal', name: 'Google Calendar', icon: 'gcal', color: '#4285f4' },
      { id: 'teams', name: 'Microsoft Teams', icon: 'teams', color: '#6264A7' },
      { id: 'meet', name: 'Google Meet', icon: 'meet', color: '#00897B' },
      { id: 'jira', name: 'Jira', icon: 'jira', color: '#0052CC' },
      { id: 'dropbox', name: 'Dropbox', icon: 'dropbox', color: '#0061FE' },
      { id: 'onedrive', name: 'OneDrive', icon: 'onedrive', color: '#0078D4' },
      { id: 'outlook', name: 'Outlook', icon: 'outlook', color: '#0078D4' }
    ];
    
    const connectedAppIds = result.rows.map(row => row.app_id);
    
    const apps = allApps.map(app => ({
      ...app,
      connected: connectedAppIds.includes(app.id),
      connectedAt: result.rows.find(r => r.app_id === app.id)?.connected_at || null
    }));
    
    res.json(apps);
  } catch (error) {
    console.error('Error fetching connected apps:', error);
    res.status(500).json({ error: 'Failed to fetch connected apps' });
  }
};

// Connect an app (OAuth redirect)
export const connectApp = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    
    // OAuth configuration for different apps
    const oauthConfigs = {
      slack: {
        authUrl: 'https://slack.com/oauth/v2/authorize',
        clientId: process.env.SLACK_CLIENT_ID,
        scopes: ['channels:read', 'chat:write', 'users:read']
      },
      github: {
        authUrl: 'https://github.com/login/oauth/authorize',
        clientId: process.env.GITHUB_CLIENT_ID,
        scopes: ['user:email', 'repo']
      },
      notion: {
        authUrl: 'https://api.notion.com/v1/oauth/authorize',
        clientId: process.env.NOTION_CLIENT_ID,
        scopes: ['authorization_code']
      },
      google: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        clientId: process.env.GOOGLE_CLIENT_ID,
        scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/calendar']
      },
      microsoft: {
        authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        clientId: process.env.MICROSOFT_CLIENT_ID,
        scopes: ['Files.ReadWrite', 'Calendars.ReadWrite']
      }
    };
    
    // Check if app is already connected
    const existing = await pool.query(
      'SELECT * FROM user_connected_apps WHERE user_id = $1 AND app_id = $2',
      [userId, appId]
    );
    
    if (existing.rows.length > 0) {
      return res.json({ message: 'App already connected', connected: true });
    }
    
    // For demo/development, we'll store the connection directly
    // In production, this would redirect to OAuth provider
    if (process.env.NODE_ENV === 'development' || !process.env.SLACK_CLIENT_ID) {
      await pool.query(
        'INSERT INTO user_connected_apps (user_id, app_id, access_token, created_at) VALUES ($1, $2, $3, NOW())',
        [userId, appId, `demo_token_${appId}`]
      );
      return res.json({ message: 'App connected successfully (demo mode)', connected: true });
    }
    
    // Build OAuth URL for production
    const config = oauthConfigs[appId] || oauthConfigs.google;
    if (appId === 'slack' || appId === 'github' || appId === 'notion') {
      const redirectUri = `${process.env.API_URL}/api/apps/callback/${appId}`;
      const authUrl = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${config.scopes.join(',')}&state=${userId}`;
      return res.json({ authUrl, needsRedirect: true });
    }
    
    res.json({ message: 'App connection initiated' });
  } catch (error) {
    console.error('Error connecting app:', error);
    res.status(500).json({ error: 'Failed to connect app' });
  }
};

// Disconnect an app
export const disconnectApp = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    
    await pool.query(
      'DELETE FROM user_connected_apps WHERE user_id = $1 AND app_id = $2',
      [userId, appId]
    );
    
    res.json({ message: 'App disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting app:', error);
    res.status(500).json({ error: 'Failed to disconnect app' });
  }
};

// OAuth callback handler
export const handleCallback = async (req, res) => {
  try {
    const { appId } = req.params;
    const { code, state: userId } = req.query;
    
    // In production, exchange code for token
    // For now, store demo connection
    await pool.query(
      'INSERT INTO user_connected_apps (user_id, app_id, access_token, created_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (user_id, app_id) DO UPDATE SET access_token = $3, connected_at = NOW()',
      [userId, appId, `token_${code}`]
    );
    
    // Redirect back to app
    res.redirect(`${process.env.FRONTEND_URL}/home?appConnected=${appId}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/home?error=connection_failed`);
  }
};

// AI Features - Chat with AI
export const aiChat = async (req, res) => {
  try {
    const { message, context } = req.body;
    const userId = req.user.id;
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return demo response
      const demoResponses = {
        'default': "I'm operating in demo mode. Configure OpenAI API key in backend environment to enable AI features. Here's what I can help with:\n\n1. **Task Management** - Create, update, and organize tasks\n2. **Summarization** - Summarize long documents or conversations\n3. **Brainstorming** - Generate ideas for projects\n4. **Writing** - Help write descriptions, comments, and more\n\nWould you like me to demonstrate any of these features?"
      };
      
      return res.json({ 
        response: demoResponses.default,
        demo: true
      });
    }
    
    // Use OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant for an incident management system. You help users with task management, brainstorming, writing, and general questions.' },
        { role: 'user', content: message }
      ],
      max_tokens: 500
    });
    
    res.json({ 
      response: completion.choices[0].message.content,
      demo: false
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};

// AI Features - Generate Image
export const aiGenerateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return placeholder
      return res.json({
        imageUrl: null,
        demo: true,
        message: 'Configure OpenAI API key in backend environment to enable image generation.'
      });
    }
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const image = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    });
    
    res.json({
      imageUrl: image.data[0].url,
      demo: false
    });
  } catch (error) {
    console.error('AI Image generation error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
};

// Get app activity/logs
export const getAppActivity = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    
    // Return mock activity for demo
    const activities = [
      { id: 1, type: 'sync', description: 'Synced 5 minutes ago', time: '5m ago' },
      { id: 2, type: 'link', description: '12 items linked', time: '1h ago' },
      { id: 3, type: 'update', description: 'Last updated', time: '2h ago' }
    ];
    
    res.json(activities);
  } catch (error) {
    console.error('Error fetching app activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};
