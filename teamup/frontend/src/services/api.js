import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

function normalizeApiUrl(value) {
  const raw = String(value || '').trim().replace(/\/+$/, '');
  if (!raw) return '';
  return raw.endsWith('/api') ? raw : `${raw}/api`;
}

const apiBaseUrl =
  normalizeApiUrl(configuredApiUrl) ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '');

export { apiBaseUrl };

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
    return "Configuration API manquante. Verifie la variable VITE_API_URL.";
  }

  if (!error.response) {
    return "Serveur inaccessible. Verifie que l'API est demarree et que VITE_API_URL est correctement configuree.";
  }

  if (error.response.status === 401) {
    return "Session expiree ou identifiants invalides. Reconnecte-toi.";
  }

  if (error.response.status === 403) {
    return "Action refusee : tu n'as pas les droits necessaires.";
  }

  if (error.response.status === 400) {
    return error.response?.data?.message || "Donnees invalides. Verifie les champs du formulaire.";
  }

  if (error.response.status === 404) {
    return "Ressource introuvable.";
  }

  if (error.response.status >= 500) {
    return error.response?.data?.message || "Erreur serveur. Reessaie plus tard.";
  }

  return error.response?.data?.message || "Une erreur est survenue";
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const relativeUrl = response.data.url;
  if (!relativeUrl) return '';
  const base = apiBaseUrl.replace(/\/api$/, '');
  return `${base}${relativeUrl}`;
}
