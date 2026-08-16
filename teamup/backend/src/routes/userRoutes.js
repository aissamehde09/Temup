import { Router } from 'express';
import { destroyMe, me, show, updateAvatar, updateMe } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema, updateAvatarSchema, updateProfileSchema } from '../utils/validationSchemas.js';

export const userRoutes = Router();

userRoutes.get('/me', requireAuth, me);
userRoutes.get('/:id', requireAuth, validate(idParamSchema), show);
userRoutes.put('/me', requireAuth, validate(updateProfileSchema), updateMe);
userRoutes.put('/me/avatar', requireAuth, validate(updateAvatarSchema), updateAvatar);
userRoutes.delete('/me', requireAuth, destroyMe);
