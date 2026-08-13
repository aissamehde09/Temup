import { Router } from 'express';
import { clearNotifications, listNotifications, readNotification } from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { mongoIdParamSchema } from '../utils/validationSchemas.js';

export const notificationRoutes = Router();

notificationRoutes.get('/notifications', requireAuth, listNotifications);
notificationRoutes.delete('/notifications', requireAuth, clearNotifications);
notificationRoutes.put('/notifications/:id/read', requireAuth, validate(mongoIdParamSchema), readNotification);
notificationRoutes.delete('/notifications/:id', requireAuth, validate(mongoIdParamSchema), readNotification);
