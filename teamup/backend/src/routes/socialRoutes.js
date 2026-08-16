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
import { validate } from '../middleware/validate.js';
import { answerFriendRequestSchema, friendRequestSchema, idParamSchema, sendMessageSchema } from '../utils/validationSchemas.js';

export const socialRoutes = Router();

socialRoutes.get('/players/:id', requireAuth, validate(idParamSchema), publicUser);
socialRoutes.post('/players/:id/friend-request', requireAuth, validate(friendRequestSchema), createFriendRequest);
socialRoutes.get('/friend-requests', requireAuth, friendRequests);
socialRoutes.put('/friend-requests/:id', requireAuth, validate(answerFriendRequestSchema), answerFriendRequest);
socialRoutes.get('/friends', requireAuth, friends);
socialRoutes.get('/conversations', requireAuth, conversations);
socialRoutes.post('/conversations/:id/messages', requireAuth, validate(sendMessageSchema), createConversationMessage);
socialRoutes.post('/players/:id/messages', requireAuth, validate(sendMessageSchema), createPrivateMessage);
