import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { demoMatches } from '../data/teamupDemo';
import { api } from '../services/api';

const MatchDataContext = createContext(null);
const STORAGE_KEY = 'teamup_created_matches';
const CITY_COORDINATES = {
  Nanterre: [48.8924, 2.2067],
  Puteaux: [48.8847, 2.2382],
  Courbevoie: [48.8967, 2.2567],
  Levallois: [48.8932, 2.2879],
};

function readCreatedMatches() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function MatchDataProvider({ children }) {
  const [createdMatches, setCreatedMatches] = useState(readCreatedMatches);
  const [serverMatches, setServerMatches] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshMatches() {
    try {
      const { data } = await api.get('/matches');
      setServerMatches(data.matches || []);
    } catch {
      // Le mode démo reste disponible si l'API est momentanément arrêtée.
      setServerMatches(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshMatches();
    const onFocus = () => refreshMatches();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const matches = useMemo(
    () => (serverMatches ? serverMatches : [...demoMatches, ...createdMatches]),
    [serverMatches, createdMatches],
  );

  async function createMatch(payload) {
    const sportId = payload.sport_name === 'Basketball' ? 1 : 2;
    try {
      const { data } = await api.post('/matches', {
        sportId,
        title: payload.title,
        city: payload.city,
        location: payload.location,
        address: payload.address,
        matchDate: payload.match_date,
        matchTime: payload.match_time.slice(0, 5),
        level: payload.level,
        maxPlayers: payload.max_players,
        description: payload.description,
        imageUrl: payload.image_url || '',
        latitude: payload.latitude,
        longitude: payload.longitude,
      });
      const created = data.match;
      setServerMatches((current) => (current ? [...current, created] : current));
      return created;
    } catch (error) {
      // Permet de continuer en démo uniquement lorsque le backend est indisponible.
      if (error.response) throw error;
    }

    const [latitude, longitude] = CITY_COORDINATES[payload.city] || CITY_COORDINATES.Nanterre;
    const created = {
      ...payload,
      id: `created-${Date.now()}`,
      sport_id: payload.sport_name === 'Basketball' ? 1 : 2,
      players_count: 1,
      organizer_first_name: payload.organizer_first_name || 'Moi',
      organizer_last_name: payload.organizer_last_name || '',
      organizer_email: payload.organizer_email || '',
      image_url: payload.sport_name === 'Basketball' ? '/img/teamup-basketball-gym-original.png' : '/img/teamup-football-original.png',
      latitude,
      longitude,
    };
    const next = [...createdMatches, created];
    setCreatedMatches(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return created;
  }

  async function deleteMatch(matchId) {
    try {
      await api.delete(`/matches/${matchId}`);
    } catch (error) {
      if (error.response) throw error;
    }
    setServerMatches((current) => (current ? current.filter((match) => String(match.id) !== String(matchId)) : current));
    setCreatedMatches((current) => current.filter((match) => String(match.id) !== String(matchId)));
    const stored = readCreatedMatches().filter((match) => String(match.id) !== String(matchId));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    return true;
  }

  const value = useMemo(() => ({ matches, createdMatches, createMatch, deleteMatch, refreshMatches, loading }), [matches, createdMatches, loading]);
  return <MatchDataContext.Provider value={value}>{children}</MatchDataContext.Provider>;
}

export function useMatchData() {
  return useContext(MatchDataContext);
}
