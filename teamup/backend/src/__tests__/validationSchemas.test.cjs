const { describe, it, expect, beforeAll } = require('@jest/globals');
const { z } = require('zod');

const level = z.enum(['Débutant', 'Intermédiaire', 'Confirmé']);
const positiveId = z.coerce.number().int().positive();
const sportNameToId = { basketball: 1, basket: 1, football: 2, foot: 2 };

function normalizeMatchBody(body) {
  const source = body && typeof body === 'object' ? body : {};
  const sportName = String(source.sportName || source.sport_name || source.sport || '').trim().toLowerCase();
  const sportIdFromName = sportNameToId[sportName];
  return {
    ...source,
    sportId: source.sportId ?? source.sport_id ?? sportIdFromName,
    matchDate: source.matchDate ?? source.match_date,
    matchTime: String(source.matchTime ?? source.match_time ?? '').slice(0, 5),
    maxPlayers: source.maxPlayers ?? source.max_players,
    imageUrl: source.imageUrl ?? source.image_url ?? '',
  };
}

const registerSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(190).toLowerCase(),
    password: z.string().min(8).max(120),
    confirmPassword: z.string().min(8).max(120),
    city: z.string().trim().min(2).max(120),
    level,
    sports: z.array(positiveId).min(1),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1),
  }),
});

const matchBodySchema = z.object({
  body: z.preprocess(normalizeMatchBody, z.object({
    sportId: positiveId,
    title: z.string().trim().min(3).max(160),
    city: z.string().trim().min(2).max(120),
    location: z.string().trim().min(2).max(180),
    address: z.string().trim().max(255).optional().or(z.literal('')),
    matchDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    matchTime: z.string().regex(/^\d{2}:\d{2}$/),
    level,
    maxPlayers: z.coerce.number().int().min(2).max(30),
    description: z.string().trim().max(1500).optional().or(z.literal('')),
    imageUrl: z.string().max(7_000_000).refine((v) => v === '' || v.startsWith('data:image/') || /^https?:\/\//.test(v)).optional().or(z.literal('')),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
  })),
});

const matchQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    sport: z.string().trim().optional(),
    city: z.string().trim().optional(),
    date: z.string().trim().optional(),
    level: level.optional(),
    organizerId: z.coerce.number().int().positive().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: positiveId }),
});

describe('registerSchema', () => {
  const valid = {
    firstName: 'Jean', lastName: 'Dupont', email: 'jean@example.com',
    password: 'password123', confirmPassword: 'password123',
    city: 'Nanterre', level: 'Intermédiaire', sports: [1],
  };

  it('accepts valid registration', () => {
    expect(registerSchema.safeParse({ body: valid }).success).toBe(true);
  });

  it('rejects short password', () => {
    expect(registerSchema.safeParse({ body: { ...valid, password: '123' } }).success).toBe(false);
  });

  it('rejects empty sports', () => {
    expect(registerSchema.safeParse({ body: { ...valid, sports: [] } }).success).toBe(false);
  });

  it('normalizes email to lowercase', () => {
    const result = registerSchema.parse({ body: { ...valid, email: 'JEAN@EXAMPLE.COM' } });
    expect(result.body.email).toBe('jean@example.com');
  });
});

describe('loginSchema', () => {
  it('accepts valid login', () => {
    expect(loginSchema.safeParse({ body: { email: 'a@b.com', password: 'pass' } }).success).toBe(true);
  });

  it('rejects empty password', () => {
    expect(loginSchema.safeParse({ body: { email: 'a@b.com', password: '' } }).success).toBe(false);
  });
});

describe('matchBodySchema', () => {
  const valid = {
    sportId: 1, title: 'Match de basket', city: 'Nanterre',
    location: 'Stade', matchDate: '2026-12-25', matchTime: '16:00',
    level: 'Intermédiaire', maxPlayers: 10,
  };

  it('accepts valid match', () => {
    expect(matchBodySchema.safeParse({ body: valid }).success).toBe(true);
  });

  it('rejects short title', () => {
    expect(matchBodySchema.safeParse({ body: { ...valid, title: 'ab' } }).success).toBe(false);
  });

  it('rejects maxPlayers < 2', () => {
    expect(matchBodySchema.safeParse({ body: { ...valid, maxPlayers: 1 } }).success).toBe(false);
  });

  it('rejects maxPlayers > 30', () => {
    expect(matchBodySchema.safeParse({ body: { ...valid, maxPlayers: 31 } }).success).toBe(false);
  });

  it('rejects invalid date format', () => {
    expect(matchBodySchema.safeParse({ body: { ...valid, matchDate: '25-12-2026' } }).success).toBe(false);
  });

  it('rejects invalid time format', () => {
    expect(matchBodySchema.safeParse({ body: { ...valid, matchTime: '4pm' } }).success).toBe(false);
  });
});

describe('matchQuerySchema', () => {
  it('accepts empty query', () => {
    expect(matchQuerySchema.safeParse({ query: {} }).success).toBe(true);
  });

  it('rejects page 0', () => {
    expect(matchQuerySchema.safeParse({ query: { page: 0 } }).success).toBe(false);
  });

  it('rejects negative page', () => {
    expect(matchQuerySchema.safeParse({ query: { page: -1 } }).success).toBe(false);
  });

  it('rejects limit > 50', () => {
    expect(matchQuerySchema.safeParse({ query: { limit: 51 } }).success).toBe(false);
  });

  it('accepts valid page and limit', () => {
    expect(matchQuerySchema.safeParse({ query: { page: 2, limit: 25 } }).success).toBe(true);
  });
});

describe('idParamSchema', () => {
  it('accepts positive integer', () => {
    expect(idParamSchema.safeParse({ params: { id: 42 } }).success).toBe(true);
  });

  it('rejects zero', () => {
    expect(idParamSchema.safeParse({ params: { id: 0 } }).success).toBe(false);
  });

  it('rejects negative', () => {
    expect(idParamSchema.safeParse({ params: { id: -5 } }).success).toBe(false);
  });
});
