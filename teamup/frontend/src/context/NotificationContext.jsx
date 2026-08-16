import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';
import { getErrorMessage } from '../services/api';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    if (!user || !localStorage.getItem('teamup_token')) {
      setNotifications([]);
      return undefined;
    }

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
        setNotifications(serverNotifications);
        setError('');
      })
      .catch((requestError) => {
        if (!active) return;
        setError(getErrorMessage(requestError));
      });

    return () => { active = false; };
  }, [user?.id]);

  async function markRead(id) {
    setNotifications((current) => current.map((item) => (
      item._id === id ? { ...item, read: true } : item
    )));
    if (!String(id).startsWith('local-') && localStorage.getItem('teamup_token')) {
      try {
        await api.put(`/notifications/${id}/read`);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      }
    }
  }

  async function markAllRead() {
    const token = localStorage.getItem('teamup_token');
    const localNotifications = notifications.filter((item) => String(item._id).startsWith('local-'));
    if (token) {
      try {
        const serverNotifications = notifications.filter((item) => !String(item._id).startsWith('local-'));
        if (serverNotifications.some((item) => !item.read)) {
          await api.put('/notifications/read-all');
        }
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      }
    }
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
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
  const value = useMemo(
    () => ({ notifications, unreadCount, notificationError: error, markRead, markAllRead, addNotification }),
    [notifications, unreadCount, error],
  );
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  return useContext(NotificationContext);
}
