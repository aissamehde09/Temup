import { getUserNotifications, removeAllNotifications, removeNotification } from '../services/notificationService.js';
import { HttpError } from '../utils/httpError.js';

export async function listNotifications(req, res, next) {
  try {
    res.status(200).json({ notifications: await getUserNotifications(req.user.id) });
  } catch (error) {
    next(error);
  }
}

export async function readNotification(req, res, next) {
  try {
    const notification = await removeNotification(req.validated.params.id, req.user.id);
    if (!notification) throw new HttpError(404, 'Notification introuvable');
    res.status(200).json({ deleted: true, notification });
  } catch (error) {
    next(error);
  }
}

export async function clearNotifications(req, res, next) {
  try {
    await removeAllNotifications(req.user.id);
    res.status(200).json({ deleted: true });
  } catch (error) {
    next(error);
  }
}
