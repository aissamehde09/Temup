import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'development-secret-change-me';
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}

