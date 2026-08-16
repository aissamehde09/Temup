import { Router } from 'express';
import {
  editMatch,
  favorite,
  join,
  leave,
  listFavorites,
  listMatches,
  listSports,
  mine,
  removeMatch,
  showMatch,
  storeMatch,
} from '../controllers/matchController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema, matchBodySchema, matchQuerySchema } from '../utils/validationSchemas.js';

export const matchRoutes = Router();

matchRoutes.get('/favorites', requireAuth, listFavorites);
matchRoutes.get('/sports', listSports);
matchRoutes.get('/my-matches', requireAuth, mine);
matchRoutes.get('/matches', validate(matchQuerySchema), listMatches);
matchRoutes.get('/matches/:id', validate(idParamSchema), showMatch);
matchRoutes.post('/matches', requireAuth, validate(matchBodySchema), storeMatch);
matchRoutes.put('/matches/:id', requireAuth, validate(idParamSchema.merge(matchBodySchema)), editMatch);
matchRoutes.delete('/matches/:id', requireAuth, validate(idParamSchema), removeMatch);
matchRoutes.post('/matches/:id/join', requireAuth, validate(idParamSchema), join);
matchRoutes.delete('/matches/:id/leave', requireAuth, validate(idParamSchema), leave);
matchRoutes.post('/matches/:id/favorite', requireAuth, validate(idParamSchema), favorite);

