import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('teamup_user');
    return storedUser ? JSON.parse(storedUser) : null;
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
        localStorage.setItem('teamup_user', JSON.stringify(data.user));
        setUser(data.user);
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
    localStorage.setItem('teamup_token', data.token);
    localStorage.setItem('teamup_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('teamup_token', data.token);
    localStorage.setItem('teamup_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('teamup_token');
    localStorage.removeItem('teamup_user');
    setUser(null);
  }

  function updateUser(patch) {
    setUser((current) => {
      const next = { ...(current || {}), ...patch };
      localStorage.setItem('teamup_user', JSON.stringify(next));
      return next;
    });
  }

  async function updateAvatar(avatarUrl) {
    const { data } = await api.put('/users/me/avatar', { avatarUrl });
    localStorage.setItem('teamup_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
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
