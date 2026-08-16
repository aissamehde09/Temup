import { describe, it, expect, vi } from 'vitest';
import { getErrorMessage } from '../services/api';

function makeAxiosError(status, data, config) {
  const error = new Error('Request failed');
  error.response = { status, data, config };
  return error;
}

function makeNetworkError() {
  return new Error('Network Error');
}

describe('getErrorMessage', () => {
  it('returns config missing message for TEAMUP_API_URL_MISSING', () => {
    const error = { code: 'TEAMUP_API_URL_MISSING' };
    expect(getErrorMessage(error)).toContain('VITE_API_URL');
  });

  it('returns network error message when no response', () => {
    expect(getErrorMessage(makeNetworkError())).toContain('Serveur inaccessible');
  });

  it('returns session expired for 401', () => {
    expect(getErrorMessage(makeAxiosError(401))).toContain('Session expiree');
  });

  it('returns access denied for 403', () => {
    expect(getErrorMessage(makeAxiosError(403))).toContain('refusee');
  });

  it('returns server message for 400', () => {
    const error = makeAxiosError(400, { message: 'Titre requis' });
    expect(getErrorMessage(error)).toBe('Titre requis');
  });

  it('returns fallback for 400 without message', () => {
    expect(getErrorMessage(makeAxiosError(400))).toContain('Donnees invalides');
  });

  it('returns not found for 404', () => {
    expect(getErrorMessage(makeAxiosError(404))).toContain('introuvable');
  });

  it('returns server error for 500', () => {
    expect(getErrorMessage(makeAxiosError(500))).toContain('Erreur serveur');
  });

  it('returns server error for 502', () => {
    expect(getErrorMessage(makeAxiosError(502))).toContain('Erreur serveur');
  });

  it('returns generic message for unknown status', () => {
    expect(getErrorMessage(makeAxiosError(418))).toContain('erreur est survenue');
  });

  it('prefers response.data.message when available', () => {
    const error = makeAxiosError(400, { message: 'Champ invalide' });
    expect(getErrorMessage(error)).toBe('Champ invalide');
  });
});
