import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { normalizeUser } from '../utils/matchNormalize';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (!localStorage.getItem('teamup_token')) return null;
    const storedUser = localStorage.getItem('teamup_user');
    try {
      return storedUser ? normalizeUser(JSON.parse(storedUser)) : null;
    } catch {
      localStorage.removeItem('teamup_user');
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('teamup_token')));

  useEffect(() => {
    async function loadUserFromToken() {
      const token = localStorage.getItem('teamup_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/users/me');
        const nextUser = normalizeUser(data.user);
        localStorage.setItem('teamup_user', JSON.stringify(nextUser));
        setUser(nextUser);
      } catch {
        localStorage.removeItem('teamup_token');
        localStorage.removeItem('teamup_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromToken();
  }, []);

  async function login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    const nextUser = normalizeUser(data.user);
    localStorage.setItem('teamup_token', data.token);
    localStorage.setItem('teamup_user', JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    const nextUser = normalizeUser(data.user);
    localStorage.setItem('teamup_token', data.token);
    localStorage.setItem('teamup_user', JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }

  function logout() {
    localStorage.removeItem('teamup_token');
    localStorage.removeItem('teamup_user');
    setUser(null);
  }

  function updateUser(patch) {
    setUser((current) => {
      const next = normalizeUser({ ...(current || {}), ...patch });
      localStorage.setItem('teamup_user', JSON.stringify(next));
      return next;
    });
  }

  async function updateAvatar(avatarUrl) {
    const { data } = await api.put('/users/me/avatar', { avatarUrl });
    const nextUser = normalizeUser(data.user);
    localStorage.setItem('teamup_user', JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      updateUser,
      updateAvatar,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
