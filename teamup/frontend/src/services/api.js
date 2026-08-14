import axios from 'axios';

export const api = axios.create({
  // Valeur de secours pour la production : Vercel remplace normalement cette
  // valeur avec VITE_API_URL au moment du build.
  baseURL: import.meta.env.VITE_API_URL || 'https://temup-production.up.railway.app/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('teamup_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('teamup_token');
      localStorage.removeItem('teamup_user');
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error) {
  return error.response?.data?.message || 'Une erreur est survenue';
}
