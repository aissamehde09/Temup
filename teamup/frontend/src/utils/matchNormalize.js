import { normalizeDateInput, normalizeTimeInput } from './matchDate';

export const CITY_COORDINATES = {
  nanterre: { latitude: 48.8924, longitude: 2.2067 },
  puteaux: { latitude: 48.8847, longitude: 2.2382 },
  courbevoie: { latitude: 48.8967, longitude: 2.2567 },
  levallois: { latitude: 48.8932, longitude: 2.2879 },
  'levallois-perret': { latitude: 48.8932, longitude: 2.2879 },
};

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeCityKey(city) {
  return normalizeText(city).toLowerCase().replace(/\s+/g, '-');
}

export function getCityCoordinates(city) {
  return CITY_COORDINATES[normalizeCityKey(city)] || null;
}

export function isTeamUpRegion(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  return Number.isFinite(lat)
    && Number.isFinite(lng)
    && lat >= 48.75
    && lat <= 49.05
    && lng >= 2.05
    && lng <= 2.45;
}

export function normalizeUser(raw = {}) {
  const fullName = normalizeText(raw.name);
  const parts = fullName.split(/\s+/).filter(Boolean);
  const firstName = normalizeText(raw.first_name || raw.firstName || parts[0]);
  const lastName = normalizeText(raw.last_name || raw.lastName || parts.slice(1).join(' '));
  const explicitAvatar = raw.avatar_url || raw.avatarUrl || raw.avatar || '';

  return {
    ...raw,
    id: raw.id,
    first_name: firstName,
    last_name: lastName,
    firstName,
    lastName,
    name: fullName || `${firstName} ${lastName}`.trim(),
    email: raw.email || '',
    city: raw.city || '',
    level: raw.level || '',
    role: raw.role || 'USER',
    avatar_url: explicitAvatar || '',
    avatarUrl: explicitAvatar || '',
  };
}

export function normalizeParticipants(rawParticipants = []) {
  if (!Array.isArray(rawParticipants)) return [];
  return rawParticipants.map((participant) => normalizeUser(participant));
}

function resolveSportName(raw = {}) {
  const sport = raw.sport_name || raw.sportName || raw.sport || raw.sport?.name || '';
  return String(sport).toLowerCase().includes('basket') ? 'Basketball' : 'Football';
}

function resolveDate(raw = {}) {
  const normalized = normalizeDateInput(raw.match_date || raw.matchDate || raw.date);
  return normalized || '';
}

export function normalizeMatch(raw = {}) {
  const participants = normalizeParticipants(raw.participants || raw.players || raw.participantsData || []);
  const city = normalizeText(raw.city);
  const cityCoordinates = getCityCoordinates(city);
  const rawLatitude = raw.latitude ?? raw.lat;
  const rawLongitude = raw.longitude ?? raw.lng ?? raw.lon;
  const hasSafeCoordinates = isTeamUpRegion(rawLatitude, rawLongitude);
  const coordinates = hasSafeCoordinates ? {
    latitude: Number(rawLatitude),
    longitude: Number(rawLongitude),
  } : cityCoordinates;
  const sportName = resolveSportName(raw);
  const organizer = normalizeUser(raw.organizer || {
    id: raw.organizer_id,
    first_name: raw.organizer_first_name,
    last_name: raw.organizer_last_name,
    email: raw.organizer_email,
    avatar_url: raw.organizer_avatar_url,
  });
  const playersCount = Number(raw.players_count ?? raw.playersCount ?? raw.participantsCount ?? participants.length ?? 0);

  return {
    ...raw,
    id: raw.id,
    title: normalizeText(raw.title) || 'Match sans titre',
    sport_name: sportName,
    sportName,
    sport: sportName,
    city,
    location: normalizeText(raw.location || raw.place || raw.address),
    address: normalizeText(raw.address),
    match_date: resolveDate(raw),
    matchDate: resolveDate(raw),
    match_time: normalizeTimeInput(raw.match_time || raw.matchTime || raw.time) || '16:00',
    matchTime: normalizeTimeInput(raw.match_time || raw.matchTime || raw.time) || '16:00',
    level: normalizeText(raw.level) || 'Intermédiaire',
    max_players: Number(raw.max_players ?? raw.maxPlayers ?? 10),
    maxPlayers: Number(raw.max_players ?? raw.maxPlayers ?? 10),
    players_count: playersCount,
    participantsCount: playersCount,
    participants,
    organizer,
    organizer_id: raw.organizer_id ?? raw.organizerId ?? organizer.id,
    organizer_email: raw.organizer_email || organizer.email || '',
    organizer_first_name: raw.organizer_first_name || organizer.first_name || organizer.firstName || 'Organisateur',
    organizer_last_name: raw.organizer_last_name || organizer.last_name || organizer.lastName || '',
    organizer_avatar_url: raw.organizer_avatar_url || organizer.avatar_url || '',
    description: normalizeText(raw.description),
    image_url: raw.image_url || raw.image || '/img/teamup-football-night-original.png',
    image: raw.image_url || raw.image || '/img/teamup-football-night-original.png',
    latitude: coordinates?.latitude,
    longitude: coordinates?.longitude,
  };
}
