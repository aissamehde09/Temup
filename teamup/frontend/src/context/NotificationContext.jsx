import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { demoNotifications } from '../data/teamupDemo';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const NotificationContext = createContext(null);

function storageKey(user) {
  return `teamup_notifications_${user?.email || 'guest'}`;
}

function readNotifications(key, user) {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(stored)) return stored;
  } catch {
    // Recreate the demo state if localStorage is unavailable or invalid.
  }
  return user?.email === 'mehdi@teamup.local' ? demoNotifications : [];
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const key = storageKey(user);
  const loadedKey = useRef(key);
  const [notifications, setNotifications] = useState(() => readNotifications(key, user));

  useEffect(() => {
    loadedKey.current = key;
    setNotifications(readNotifications(key, user));
    let active = true;
    if (user && localStorage.getItem('teamup_token')) {
      api.get('/notifications')
        .then(({ data }) => {
          if (!active) return;
          const serverNotifications = (data.notifications || []).map((item) => ({
            _id: item._id,
            type: item.type,
            message: item.message,
            context: item.context || '',
            read: Boolean(item.read),
            createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR') : 'À l’instant',
          }));
          setNotifications((current) => {
            const localOnly = current.filter((local) => !serverNotifications.some((remote) => remote._id === local._id));
            return [...serverNotifications, ...localOnly];
          });
        })
        .catch(() => {});
    }
    return () => { active = false; };
  }, [key, user]);

  useEffect(() => {
    if (loadedKey.current !== key) return;
    localStorage.setItem(key, JSON.stringify(notifications));
  }, [key, notifications]);

  function markRead(id) {
    setNotifications((current) => current.filter((item) => item._id !== id));
    if (!String(id).startsWith('local-') && localStorage.getItem('teamup_token')) {
      api.delete(`/notifications/${id}`).catch(() => {});
    }
  }

  function markAllRead() {
    setNotifications([]);
    localStorage.setItem(key, JSON.stringify([]));
    if (localStorage.getItem('teamup_token')) api.delete('/notifications').catch(() => {});
  }

  function addNotification(notification) {
    const next = {
      _id: `local-${Date.now()}`,
      type: notification.type || 'INFO',
      message: notification.message,
      context: notification.context || '',
      createdAt: notification.createdAt || 'À l’instant',
      read: false,
    };
    setNotifications((current) => [next, ...current]);
  }

  const unreadCount = notifications.filter((item) => !item.read).length;
  const value = useMemo(() => ({ notifications, unreadCount, markRead, markAllRead, addNotification }), [notifications, unreadCount]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  return useContext(NotificationContext);
}
