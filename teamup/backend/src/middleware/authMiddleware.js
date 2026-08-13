import { query } from '../utils/db.js';
import { HttpError } from '../utils/httpError.js';
import { verifyToken } from '../utils/auth.js';
import { sanitizeUser } from '../utils/sanitize.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new HttpError(401, 'Authentification requise');
    }

    const payload = verifyToken(header.slice(7));
    const users = await query('SELECT * FROM users WHERE id = :id', { id: payload.id });

    if (!users.length) {
      throw new HttpError(401, 'Utilisateur introuvable');
    }

    req.user = sanitizeUser(users[0]);
    next();
  } catch (error) {
    next(error.status ? error : new HttpError(401, 'Token invalide ou expiré'));
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return next(new HttpError(403, 'Accès administrateur requis'));
  }
  next();
}

