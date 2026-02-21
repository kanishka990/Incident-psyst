import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import * as appConnectionController from '../controllers/app.connection.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all connected apps
router.get('/', appConnectionController.getConnectedApps);

// Connect an app
router.post('/connect/:appId', appConnectionController.connectApp);

// Disconnect an app
router.delete('/disconnect/:appId', appConnectionController.disconnectApp);

// Get app activity
router.get('/activity/:appId', appConnectionController.getAppActivity);

// OAuth callback
router.get('/callback/:appId', appConnectionController.handleCallback);

// AI Chat
router.post('/ai/chat', appConnectionController.aiChat);

// AI Generate Image
router.post('/ai/generate-image', appConnectionController.aiGenerateImage);

export default router;
