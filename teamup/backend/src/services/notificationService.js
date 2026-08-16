import { Notification } from '../models/Notification.js';

export async function createNotification({ userId, type, message, context = '' }) {
  if (!userId || !type || !message) return null;
  return Notification.create({ userId, type, message, context });
}

export async function getUserNotifications(userId) {
  return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
}

export async function markNotificationRead(id, userId) {
  return Notification.findOneAndUpdate({ _id: id, userId }, { read: true }, { new: true });
}

export async function markAllNotificationsRead(userId) {
  return Notification.updateMany({ userId, read: false }, { read: true });
}

export async function removeNotification(id, userId) {
  return Notification.findOneAndDelete({ _id: id, userId });
}

export async function removeAllNotifications(userId) {
  return Notification.deleteMany({ userId });
}
