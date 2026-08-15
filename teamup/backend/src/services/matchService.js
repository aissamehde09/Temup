import { pool, query } from '../utils/db.js';
import { HttpError } from '../utils/httpError.js';
import { createNotification } from './notificationService.js';

const matchSelect = `
  SELECT
    m.*,
    s.name AS sport_name,
    s.slug AS sport_slug,
    u.first_name AS organizer_first_name,
    u.last_name AS organizer_last_name,
    u.email AS organizer_email,
    u.avatar_url AS organizer_avatar_url,
    (
      SELECT COUNT(*)
      FROM participations p
      WHERE p.match_id = m.id AND p.status = 'CONFIRMED'
    ) AS players_count
  FROM matches m
  INNER JOIN sports s ON s.id = m.sport_id
  INNER JOIN users u ON u.id = m.organizer_id
`;

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

async function resolveLocationCoordinates(location) {
  const direct = coordinatesFromUrl(location);
  if (direct) return direct;
  const urlMatch = String(location || '').match(/https?:\/\/[^\s]+/i);
  const locationUrl = urlMatch?.[0]?.replace(/[),.;]+$/, '');
  if (!/^https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl|maps\.google\.)/i.test(locationUrl || '')) return null;
  try {
    const response = await fetch(locationUrl, { redirect: 'follow', signal: AbortSignal.timeout(5000) });
    const fromRedirect = coordinatesFromUrl(response.url);
    if (fromRedirect) return fromRedirect;
    // Google peut conserver le lien court dans l’URL de redirection, mais
    // expose parfois les coordonnées uniquement dans le HTML de la page.
    const html = await response.text();
    return coordinatesFromUrl(html);
  } catch {
    return null;
  }
}

function isTeamUpRegion(coordinates, city) {
  if (!coordinates) return false;
  const latitude = Number(coordinates.latitude);
  const longitude = Number(coordinates.longitude);
  // TeamUp couvre l’ouest parisien. On refuse une redirection Google
  // manifestement située dans une autre région (ex. Nigeria).
  if (latitude < 48.5 || latitude > 49.2 || longitude < 1.5 || longitude > 3.5) return false;
  return Boolean(city);
}

function assertFutureMatchDate(matchDate, matchTime) {
  const timestamp = Date.parse(`${matchDate}T${matchTime}`);
  if (!Number.isFinite(timestamp) || timestamp <= Date.now()) {
    throw new HttpError(400, 'La date et l’heure du match doivent être dans le futur');
  }
}

async function hydrateCoordinates(rows) {
  return Promise.all(rows.map(async (row) => {
    if (row.latitude && row.longitude) return row;
    const resolved = await resolveLocationCoordinates(row.location);
    if (!isTeamUpRegion(resolved, row.city)) return row;
    await query(
      'UPDATE matches SET latitude = :latitude, longitude = :longitude WHERE id = :id',
      { id: row.id, latitude: resolved.latitude, longitude: resolved.longitude },
    );
    return { ...row, ...resolved };
  }));
}

export async function getSports() {
  return query('SELECT id, name, slug FROM sports ORDER BY name');
}

export async function getMatches(filters = {}) {
  const conditions = [];
  const params = {};

  if (filters.search) {
    conditions.push('(m.title LIKE :search OR m.city LIKE :search OR m.location LIKE :search)');
    params.search = `%${filters.search}%`;
  }
  if (filters.sport) {
    conditions.push('s.slug = :sport');
    params.sport = filters.sport;
  }
  if (filters.city) {
    conditions.push('m.city LIKE :city');
    params.city = `%${filters.city}%`;
  }
  if (filters.level) {
    conditions.push('m.level = :level');
    params.level = filters.level;
  }
  if (filters.date) {
    conditions.push('m.match_date = :date');
    params.date = filters.date;
  }
  if (filters.organizerId) {
    conditions.push('m.organizer_id = :organizerId');
    params.organizerId = filters.organizerId;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = await query(
    `${matchSelect}
     ${where}
     ORDER BY m.match_date ASC, m.match_time ASC`,
    params,
  );
  return hydrateCoordinates(rows);
}

export async function getMatchById(id) {
  const rows = await query(`${matchSelect} WHERE m.id = :id`, { id });
  if (!rows.length) throw new HttpError(404, 'Match introuvable');

  // Les matchs créés avant l’ajout des coordonnées sont réparés à la volée.
  // Ainsi, un ancien lien Google Maps devient utilisable sur la carte sans
  // demander à l’utilisateur de recréer son match.
  const hydrated = await hydrateCoordinates(rows);
  rows[0] = hydrated[0];

  const participants = await query(
    `SELECT u.id, u.first_name, u.last_name, u.avatar_url, u.level
     FROM participations p
     INNER JOIN users u ON u.id = p.user_id
     WHERE p.match_id = :id AND p.status = 'CONFIRMED'
     ORDER BY p.created_at ASC`,
    { id },
  );

  return { ...rows[0], participants };
}

export async function createMatch(data, userId) {
  assertFutureMatchDate(data.matchDate, data.matchTime);
  const [sport] = await query('SELECT id FROM sports WHERE id = :sportId', { sportId: data.sportId });
  if (!sport) throw new HttpError(400, 'Sport invalide');
  const resolvedCoordinates = await resolveLocationCoordinates(data.location);

  const result = await query(
    `INSERT INTO matches
     (sport_id, organizer_id, title, city, location, address, match_date, match_time, level, max_players, description, image_url, latitude, longitude)
     VALUES
     (:sportId, :organizerId, :title, :city, :location, :address, :matchDate, :matchTime, :level, :maxPlayers, :description, :imageUrl, :latitude, :longitude)`,
    {
      sportId: data.sportId,
      organizerId: userId,
      title: data.title,
      city: data.city,
      location: data.location,
      address: data.address || null,
      matchDate: data.matchDate,
      matchTime: data.matchTime,
      level: data.level,
      maxPlayers: data.maxPlayers,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      latitude: data.latitude ?? resolvedCoordinates?.latitude ?? null,
      longitude: data.longitude ?? resolvedCoordinates?.longitude ?? null,
    },
  );
  const createdMatch = await getMatchById(result.insertId);
  const users = await query('SELECT id FROM users WHERE id <> :organizerId', { organizerId: userId });
  await Promise.all(users.map((recipient) => createNotification({
    userId: recipient.id,
    type: 'MATCH_CREATED',
    message: `${createdMatch.organizer_first_name} a créé un nouveau match`,
    context: createdMatch.title,
  }).catch((error) => {
    console.error('Notification de création non envoyée:', error.message);
    return null;
  })));
  return createdMatch;
}

export async function updateMatch(id, data, user) {
  const match = await getMatchById(id);
  if (match.organizer_id !== user.id) throw new HttpError(403, 'Seul l’organisateur peut modifier ce match');
  assertFutureMatchDate(data.matchDate, data.matchTime);
  const resolvedCoordinates = await resolveLocationCoordinates(data.location);

  await query(
    `UPDATE matches SET
      sport_id = :sportId, title = :title, city = :city, location = :location, address = :address,
      match_date = :matchDate, match_time = :matchTime, level = :level, max_players = :maxPlayers,
      description = :description, image_url = :imageUrl,
      latitude = :latitude, longitude = :longitude
     WHERE id = :id`,
    {
      id,
      sportId: data.sportId,
      title: data.title,
      city: data.city,
      location: data.location,
      address: data.address || null,
      matchDate: data.matchDate,
      matchTime: data.matchTime,
      level: data.level,
      maxPlayers: data.maxPlayers,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      latitude: data.latitude ?? resolvedCoordinates?.latitude ?? null,
      longitude: data.longitude ?? resolvedCoordinates?.longitude ?? null,
    },
  );

  await createNotification({
    userId: match.organizer_id,
    type: 'MATCH_UPDATED',
    message: `Ton match "${match.title}" a été modifié`,
  });

  return getMatchById(id);
}

export async function deleteMatch(id, user) {
  const match = await getMatchById(id);
  if (match.organizer_id !== user.id && user.role !== 'ADMIN') {
    throw new HttpError(403, 'Seul l’organisateur ou un administrateur peut supprimer ce match');
  }

  await query('DELETE FROM matches WHERE id = :id', { id });
  return { deleted: true };
}

export async function joinMatch(id, user) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [matches] = await connection.execute(
      `${matchSelect} WHERE m.id = :id FOR UPDATE`,
      { id },
    );
    const match = matches[0];

    if (!match) throw new HttpError(404, 'Match introuvable');
    // MySQL peut renvoyer DATE sous forme de Date ou de chaîne. On conserve
    // volontairement les composantes calendaires locales pour éviter qu'un
    // décalage UTC transforme le 14 août en 13 août.
    const matchDate = match.match_date instanceof Date
      ? `${match.match_date.getFullYear()}-${String(match.match_date.getMonth() + 1).padStart(2, '0')}-${String(match.match_date.getDate()).padStart(2, '0')}`
      : String(match.match_date).slice(0, 10);
    const matchTime = String(match.match_time || '00:00:00').slice(0, 8);
    const matchTimestamp = Date.parse(`${matchDate}T${matchTime}`);
    if (!Number.isFinite(matchTimestamp) || matchTimestamp < Date.now()) {
      throw new HttpError(409, 'Impossible de rejoindre un match passé');
    }
    if (match.organizer_id === user.id) throw new HttpError(409, 'L’organisateur ne peut pas rejoindre son propre match');
    if (Number(match.players_count) >= Number(match.max_players)) throw new HttpError(409, 'Match complet');

    const [existing] = await connection.execute(
      'SELECT id FROM participations WHERE user_id = :userId AND match_id = :matchId AND status = "CONFIRMED"',
      { userId: user.id, matchId: id },
    );
    if (existing.length) throw new HttpError(409, 'Tu es déjà inscrit à ce match');

    await connection.execute('INSERT INTO participations (user_id, match_id) VALUES (:userId, :matchId)', {
      userId: user.id,
      matchId: id,
    });
    await connection.commit();

    try {
      await createNotification({
        userId: match.organizer_id,
        type: 'MATCH_JOINED',
        message: `${user.first_name} a rejoint ton match "${match.title}"`,
      });
    } catch (notificationError) {
      // Une panne MongoDB ne doit pas annuler une participation déjà validée dans MySQL.
      console.error('Notification de participation non envoyée:', notificationError.message);
    }

    return getMatchById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function leaveMatch(id, user) {
  const match = await getMatchById(id);
  const result = await query(
    'DELETE FROM participations WHERE user_id = :userId AND match_id = :matchId',
    { userId: user.id, matchId: id },
  );
  if (!result.affectedRows) throw new HttpError(404, 'Participation introuvable');

  await createNotification({
    userId: match.organizer_id,
    type: 'MATCH_LEFT',
    message: `${user.first_name} a quitté ton match "${match.title}"`,
  });

  return { match: await getMatchById(id) };
}

export async function toggleFavorite(id, userId) {
  const existing = await query('SELECT id FROM favorites WHERE user_id = :userId AND match_id = :matchId', {
    userId,
    matchId: id,
  });
  if (existing.length) {
    await query('DELETE FROM favorites WHERE user_id = :userId AND match_id = :matchId', { userId, matchId: id });
    return { favorite: false };
  }
  await query('INSERT INTO favorites (user_id, match_id) VALUES (:userId, :matchId)', { userId, matchId: id });
  return { favorite: true };
}

export async function getMyMatches(userId) {
  const organized = await getMatches({ organizerId: userId });
  const participating = await query(
    `${matchSelect}
     INNER JOIN participations mine ON mine.match_id = m.id AND mine.user_id = :userId
     ORDER BY m.match_date ASC`,
    { userId },
  );
  return { organized, participating };
}
