import { query } from '../utils/db.js';
import { sanitizeUser } from '../utils/sanitize.js';

export async function findUserByEmail(email) {
  const users = await query('SELECT * FROM users WHERE email = :email', { email });
  return users[0] || null;
}

export async function findUserById(id) {
  const users = await query('SELECT * FROM users WHERE id = :id', { id });
  return sanitizeUser(users[0]);
}

export async function getUserSports(userId) {
  return query(
    `SELECT s.id, s.name, s.slug
     FROM sports s
     INNER JOIN user_sports us ON us.sport_id = s.id
     WHERE us.user_id = :userId
     ORDER BY s.name`,
    { userId },
  );
}

export async function getPublicUserProfile(userId) {
  const user = await findUserById(userId);
  if (!user) return null;

  const sports = await getUserSports(userId);
  const statsRows = await query(
    `SELECT
      (SELECT COUNT(*) FROM participations WHERE user_id = :userId) AS played_count,
      (SELECT COALESCE(ROUND(AVG(rating), 1), 0) FROM reviews WHERE reviewed_user_id = :userId) AS average_rating`,
    { userId },
  );

  return {
    ...user,
    sports,
    stats: statsRows[0],
  };
}

export async function updateUserProfile(userId, data) {
  await query(
    `UPDATE users
     SET first_name = :firstName, last_name = :lastName, city = :city, level = :level, bio = :bio
     WHERE id = :userId`,
    {
      userId,
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.city,
      level: data.level,
      bio: data.bio || null,
    },
  );
  return findUserById(userId);
}

export async function updateUserAvatar(userId, avatarUrl) {
  await query('UPDATE users SET avatar_url = :avatarUrl WHERE id = :userId', { userId, avatarUrl: avatarUrl || null });
  return findUserById(userId);
}
