import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiBaseUrl =
  configuredApiUrl ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '');

export const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  if (!apiBaseUrl) {
    const error = new Error('VITE_API_URL manquant');
    error.code = 'TEAMUP_API_URL_MISSING';
    return Promise.reject(error);
  }

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
  if (error.code === 'TEAMUP_API_URL_MISSING') {
    return 'Configuration API manquante. Ajoute VITE_API_URL sur Vercel avec l’URL Railway terminée par /api.';
  }

  if (!error.response) {
    return 'Serveur inaccessible. Vérifie que l’API Railway est démarrée et que VITE_API_URL est correctement configurée sur Vercel.';
  }

  if (error.response.status === 401) {
    return 'Session expirée ou identifiants invalides. Reconnecte-toi.';
  }

  if (error.response.status === 403) {
    return 'Action refusée : tu n’as pas les droits nécessaires.';
  }

  if (error.response.status === 404) {
    return 'Ressource introuvable.';
  }

  if (error.response.status >= 500) {
    return 'Erreur serveur. Vérifie les logs Railway du backend.';
  }

  return error.response?.data?.message || 'Une erreur est survenue';
}
