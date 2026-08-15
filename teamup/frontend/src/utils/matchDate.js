export function normalizeDateInput(value) {
  if (!value) return '';

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? '' : value.toISOString().slice(0, 10);
  }

  const raw = String(value).trim();
  if (!raw) return '';

  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  const frenchMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (frenchMatch) {
    const day = frenchMatch[1].padStart(2, '0');
    const month = frenchMatch[2].padStart(2, '0');
    return `${frenchMatch[3]}-${month}-${day}`;
  }

  return '';
}

export function normalizeTimeInput(value) {
  if (!value) return '';
  const raw = String(value).trim().replace('h', ':');
  const match = raw.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return '';
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

export function getMatchDate(matchOrDate) {
  if (typeof matchOrDate === 'object' && matchOrDate !== null) {
    return normalizeDateInput(matchOrDate.match_date || matchOrDate.matchDate || matchOrDate.date);
  }
  return normalizeDateInput(matchOrDate);
}

export function getMatchTime(matchOrTime) {
  if (typeof matchOrTime === 'object' && matchOrTime !== null) {
    return normalizeTimeInput(matchOrTime.match_time || matchOrTime.matchTime || matchOrTime.time);
  }
  return normalizeTimeInput(matchOrTime);
}

export function getMatchDateTime(match) {
  const date = getMatchDate(match);
  if (!date) return null;
  const time = getMatchTime(match) || '00:00';
  const dateTime = new Date(`${date}T${time}:00`);
  return Number.isNaN(dateTime.getTime()) ? null : dateTime;
}

export function isPastMatch(match) {
  const dateTime = getMatchDateTime(match);
  if (!dateTime) return false;
  return dateTime.getTime() < Date.now();
}

export function formatMatchDate(matchOrDate, options = {}) {
  const { includeYear = true, fallback = 'Date à confirmer' } = options;
  const normalized = getMatchDate(matchOrDate);
  if (!normalized) return fallback;

  const date = new Date(`${normalized}T12:00:00`);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(includeYear ? { year: 'numeric' } : {}),
  }).format(date);
}

export function formatShortMatchDate(matchOrDate) {
  return formatMatchDate(matchOrDate, { includeYear: false });
}

export function formatMatchTime(matchOrTime) {
  return getMatchTime(matchOrTime) || 'Heure à confirmer';
}
