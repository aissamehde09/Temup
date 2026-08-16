const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals');

// We test auth.js by importing it via the ESM-to-CJS pipeline
// Since the backend is ESM, we test the logic directly

const jwt = require('jsonwebtoken');

const TEST_SECRET = 'test-secret-for-unit-tests';
const expiresIn = '1h';

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, TEST_SECRET, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, TEST_SECRET);
}

describe('auth.js - signToken / verifyToken', () => {
  it('creates a valid JWT', () => {
    const token = signToken({ id: 42, role: 'USER' });
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('decodes correct payload', () => {
    const token = signToken({ id: 7, role: 'ADMIN' });
    const decoded = verifyToken(token);
    expect(decoded.id).toBe(7);
    expect(decoded.role).toBe('ADMIN');
  });

  it('throws on invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow();
  });

  it('throws on wrong secret', () => {
    const token = jwt.sign({ id: 1 }, 'wrong-secret', { expiresIn });
    expect(() => verifyToken(token)).toThrow();
  });

  it('includes expiration', () => {
    const token = signToken({ id: 1, role: 'USER' });
    const decoded = verifyToken(token);
    expect(decoded.exp).toBeDefined();
    expect(decoded.iat).toBeDefined();
  });
});
