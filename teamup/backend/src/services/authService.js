import bcrypt from 'bcrypt';
import { pool, query } from '../utils/db.js';
import { HttpError } from '../utils/httpError.js';
import { signToken } from '../utils/auth.js';
import { sanitizeUser } from '../utils/sanitize.js';
import { findUserByEmail } from './userService.js';

export async function registerUser(data) {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) throw new HttpError(409, 'Cet email est déjà utilisé');
  if (data.password !== data.confirmPassword) throw new HttpError(400, 'Les mots de passe ne correspondent pas');

  const passwordHash = await bcrypt.hash(data.password, 10);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO users (first_name, last_name, email, password_hash, city, level)
       VALUES (:firstName, :lastName, :email, :passwordHash, :city, :level)`,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash,
        city: data.city,
        level: data.level,
      },
    );

    const userId = result.insertId;
    for (const sportId of data.sports) {
      await connection.execute('INSERT INTO user_sports (user_id, sport_id) VALUES (:userId, :sportId)', {
        userId,
        sportId,
      });
    }

    await connection.commit();
    const user = await query('SELECT * FROM users WHERE id = :userId', { userId });
    return { user: sanitizeUser(user[0]), token: signToken(user[0]) };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) throw new HttpError(401, 'Identifiants invalides');

  const passwordIsValid = await bcrypt.compare(password, user.password_hash);
  if (!passwordIsValid) throw new HttpError(401, 'Identifiants invalides');

  return { user: sanitizeUser(user), token: signToken(user) };
}

