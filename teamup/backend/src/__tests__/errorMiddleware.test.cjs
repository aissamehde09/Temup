const { describe, it, expect, jest: { fn } } = require('@jest/globals');

function errorMiddleware(error, req, res, next) {
  const status = error.status || (error.code === 'ER_DATA_TOO_LONG' || error.code === 'ER_BAD_FIELD_ERROR' ? 400 : 500);
  let message = error.message;
  if (error.code === 'ER_DATA_TOO_LONG') message = 'La photo est trop volumineuse pour la base.';
  if (error.code === 'ER_BAD_FIELD_ERROR') message = 'La base TeamUp n\'est pas à jour.';
  if (!message) message = 'Erreur serveur';

  if (status === 500) {
    console.error(error);
  }

  res.status(status).json({ message });
}

function mockRes() {
  const res = { status: fn().mockReturnThis(), json: fn().mockReturnThis() };
  return res;
}

describe('errorMiddleware', () => {
  it('returns 400 for ER_DATA_TOO_LONG', () => {
    const error = { code: 'ER_DATA_TOO_LONG', message: '' };
    const res = mockRes();
    errorMiddleware(error, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: expect.stringContaining('photo') });
  });

  it('returns 400 for ER_BAD_FIELD_ERROR', () => {
    const error = { code: 'ER_BAD_FIELD_ERROR', message: '' };
    const res = mockRes();
    errorMiddleware(error, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns custom status for HttpError', () => {
    const error = { status: 404, message: 'Match introuvable' };
    const res = mockRes();
    errorMiddleware(error, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Match introuvable' });
  });

  it('returns 500 for unknown errors', () => {
    const error = new Error('Something broke');
    const res = mockRes();
    errorMiddleware(error, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('uses "Erreur serveur" when message is empty', () => {
    const error = { message: '' };
    const res = mockRes();
    errorMiddleware(error, {}, res, () => {});
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur' });
  });

  it('uses "Erreur serveur" when message is undefined', () => {
    const error = {};
    const res = mockRes();
    errorMiddleware(error, {}, res, () => {});
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur' });
  });
});
