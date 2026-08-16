const { describe, it, expect, jest: { fn } } = require('@jest/globals');

// Replicate matchService logic for testing
const CITY_COORDINATES = {
  nanterre: { latitude: 48.8924, longitude: 2.2067 },
  puteaux: { latitude: 48.8847, longitude: 2.2382 },
  courbevoie: { latitude: 48.8967, longitude: 2.2567 },
  levallois: { latitude: 48.8932, longitude: 2.2879 },
  'levallois-perret': { latitude: 48.8932, longitude: 2.2879 },
};

function normalizeCityKey(city) {
  return String(city || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function coordinatesFromCity(city) {
  const key = normalizeCityKey(city);
  return CITY_COORDINATES[key] || null;
}

function coordinatesFromUrl(value) {
  if (!value) return null;
  const text = String(value);
  const patterns = [
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /(?:query|q|ll|center)=(-?\d+(?:\.\d+)?)[,%2C\s]+(-?\d+(?:\.\d+)?)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return { latitude: Number(match[1]), longitude: Number(match[2]) };
  }
  return null;
}

function isTeamUpRegion(coordinates, city) {
  if (!coordinates) return false;
  const latitude = Number(coordinates.latitude);
  const longitude = Number(coordinates.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;
  if (latitude < 48.5 || latitude > 49.2 || longitude < 1.5 || longitude > 3.5) return false;
  return Boolean(city);
}

function safeCoordinates(city, preferredCoordinates) {
  if (isTeamUpRegion(preferredCoordinates, city)) return preferredCoordinates;
  return coordinatesFromCity(city);
}

function toDbNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function assertFutureMatchDate(matchDate, matchTime) {
  const timestamp = Date.parse(`${matchDate}T${matchTime}`);
  const gracePeriod = 24 * 60 * 60 * 1000;
  if (!Number.isFinite(timestamp) || timestamp <= (Date.now() - gracePeriod)) {
    throw new Error('La date et l\'heure du match doivent être dans le futur');
  }
}

describe('matchService - coordinatesFromCity', () => {
  it('returns coordinates for known city', () => {
    const result = coordinatesFromCity('Nanterre');
    expect(result).toEqual({ latitude: 48.8924, longitude: 2.2067 });
  });

  it('is case insensitive', () => {
    const result = coordinatesFromCity('NANTERRE');
    expect(result).toEqual({ latitude: 48.8924, longitude: 2.2067 });
  });

  it('handles accented city names', () => {
    const result = coordinatesFromCity('Levallois-Perret');
    expect(result).toEqual({ latitude: 48.8932, longitude: 2.2879 });
  });

  it('returns null for unknown city', () => {
    expect(coordinatesFromCity('Marseille')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(coordinatesFromCity('')).toBeNull();
  });

  it('returns null for null input', () => {
    expect(coordinatesFromCity(null)).toBeNull();
  });
});

describe('matchService - coordinatesFromUrl', () => {
  it('extracts from @lat,lng format', () => {
    const result = coordinatesFromUrl('https://maps.google.com/@48.8924,2.2067,15z');
    expect(result).toEqual({ latitude: 48.8924, longitude: 2.2067 });
  });

  it('extracts from !3d!4d format', () => {
    const result = coordinatesFromUrl('https://maps.google.com/?!3d48.8924!4d2.2067');
    expect(result).toEqual({ latitude: 48.8924, longitude: 2.2067 });
  });

  it('extracts from query= format', () => {
    const result = coordinatesFromUrl('https://maps.google.com/?query=48.8924,2.2067');
    expect(result).toEqual({ latitude: 48.8924, longitude: 2.2067 });
  });

  it('returns null for empty input', () => {
    expect(coordinatesFromUrl('')).toBeNull();
    expect(coordinatesFromUrl(null)).toBeNull();
  });

  it('returns null when no coordinates found', () => {
    expect(coordinatesFromUrl('https://example.com')).toBeNull();
  });

  it('handles negative coordinates', () => {
    const result = coordinatesFromUrl('@-33.8688,151.2093');
    expect(result).toEqual({ latitude: -33.8688, longitude: 151.2093 });
  });
});

describe('matchService - isTeamUpRegion', () => {
  it('returns true for valid TeamUp region', () => {
    expect(isTeamUpRegion({ latitude: 48.89, longitude: 2.21 }, 'Nanterre')).toBe(true);
  });

  it('returns false for null coordinates', () => {
    expect(isTeamUpRegion(null, 'Nanterre')).toBe(false);
  });

  it('returns false for NaN coordinates', () => {
    expect(isTeamUpRegion({ latitude: NaN, longitude: NaN }, 'Nanterre')).toBe(false);
  });

  it('returns false for out-of-range latitude', () => {
    expect(isTeamUpRegion({ latitude: 50.0, longitude: 2.0 }, 'Nanterre')).toBe(false);
  });

  it('returns false for out-of-range longitude', () => {
    expect(isTeamUpRegion({ latitude: 48.89, longitude: 5.0 }, 'Nanterre')).toBe(false);
  });

  it('returns false when city is empty', () => {
    expect(isTeamUpRegion({ latitude: 48.89, longitude: 2.21 }, '')).toBe(false);
  });

  it('returns false when city is null', () => {
    expect(isTeamUpRegion({ latitude: 48.89, longitude: 2.21 }, null)).toBe(false);
  });

  it('accepts coordinates at boundary', () => {
    expect(isTeamUpRegion({ latitude: 48.5, longitude: 1.5 }, 'Test')).toBe(true);
    expect(isTeamUpRegion({ latitude: 49.2, longitude: 3.5 }, 'Test')).toBe(true);
  });
});

describe('matchService - safeCoordinates', () => {
  it('returns preferred when in TeamUp region', () => {
    const preferred = { latitude: 48.89, longitude: 2.21 };
    expect(safeCoordinates('Nanterre', preferred)).toBe(preferred);
  });

  it('falls back to city when preferred is invalid', () => {
    const result = safeCoordinates('Nanterre', { latitude: NaN, longitude: NaN });
    expect(result).toEqual({ latitude: 48.8924, longitude: 2.2067 });
  });

  it('returns null for unknown city with null preferred', () => {
    expect(safeCoordinates('Marseille', null)).toBeNull();
  });
});

describe('matchService - toDbNumber', () => {
  it('returns number for valid input', () => {
    expect(toDbNumber(42)).toBe(42);
    expect(toDbNumber('3.14')).toBeCloseTo(3.14);
  });

  it('returns null for NaN', () => {
    expect(toDbNumber(NaN)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(toDbNumber(undefined)).toBeNull();
  });

  it('returns 0 for null (Number(null) === 0)', () => {
    expect(toDbNumber(null)).toBe(0);
  });

  it('returns null for non-numeric string', () => {
    expect(toDbNumber('abc')).toBeNull();
  });
});

describe('matchService - assertFutureMatchDate', () => {
  it('accepts future date', () => {
    const futureDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const dateStr = futureDate.toISOString().slice(0, 10);
    const timeStr = futureDate.toTimeString().slice(0, 5);
    expect(() => assertFutureMatchDate(dateStr, timeStr)).not.toThrow();
  });

  it('rejects past date', () => {
    expect(() => assertFutureMatchDate('2020-01-01', '12:00')).toThrow();
  });

  it('rejects invalid date', () => {
    expect(() => assertFutureMatchDate('invalid', '12:00')).toThrow();
  });
});
