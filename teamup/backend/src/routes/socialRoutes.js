import { Router } from 'express';
import {
  answerFriendRequest,
  conversations,
  createConversationMessage,
  createFriendRequest,
  createPrivateMessage,
  friendRequests,
  friends,
  publicUser,
} from '../controllers/socialController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const socialRoutes = Router();

socialRoutes.get('/players/:id', requireAuth, publicUser);
socialRoutes.post('/players/:id/friend-request', requireAuth, createFriendRequest);
socialRoutes.get('/friend-requests', requireAuth, friendRequests);
socialRoutes.put('/friend-requests/:id', requireAuth, answerFriendRequest);
socialRoutes.get('/friends', requireAuth, friends);
socialRoutes.get('/conversations', requireAuth, conversations);
socialRoutes.post('/conversations/:id/messages', requireAuth, createConversationMessage);
socialRoutes.post('/players/:id/messages', requireAuth, createPrivateMessage);
