import { query } from '../utils/db.js';
import { getPublicUserProfile, getUserSports, updateUserAvatar, updateUserProfile, deleteUserAccount } from '../services/userService.js';
import { HttpError } from '../utils/httpError.js';

export async function me(req, res, next) {
  try {
    const sports = await getUserSports(req.user.id);
    const statsRows = await query(
      `SELECT
        (SELECT COUNT(*) FROM matches WHERE organizer_id = :userId) AS organized_count,
        (SELECT COUNT(*) FROM participations WHERE user_id = :userId) AS participations_count,
        (SELECT COALESCE(ROUND(AVG(rating), 1), 0) FROM reviews WHERE reviewed_user_id = :userId) AS average_rating`,
      { userId: req.user.id },
    );
    res.status(200).json({ user: { ...req.user, sports, stats: statsRows[0] } });
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req, res, next) {
  try {
    const user = await updateUserProfile(req.user.id, req.validated.body);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function updateAvatar(req, res, next) {
  try {
    const user = await updateUserAvatar(req.user.id, req.validated.body.avatarUrl);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function destroyMe(req, res, next) {
  try {
    await deleteUserAccount(req.user.id);
    res.status(200).json({ deleted: true });
  } catch (error) {
    next(error);
  }
}

export async function show(req, res, next) {
  try {
    const user = await getPublicUserProfile(req.params.id);
    if (!user) throw new HttpError(404, 'Utilisateur introuvable');
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}
