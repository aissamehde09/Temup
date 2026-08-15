import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const MatchDataContext = createContext(null);
const STORAGE_KEY = 'teamup_created_matches';
function readCreatedMatches() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function MatchDataProvider({ children }) {
  const [createdMatches, setCreatedMatches] = useState(readCreatedMatches);
  const [serverMatches, setServerMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function refreshMatches() {
    try {
      const { data } = await api.get('/matches');
      setServerMatches(data.matches || []);
      setError(null);
    } catch (requestError) {
      setServerMatches([]);
      setError(requestError);
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
    () => serverMatches,
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
      setServerMatches((current) => (current ? [...current, created] : [created]));
      return created;
    } catch (error) {
      throw error;
    }
  }

  async function deleteMatch(matchId) {
    try {
      await api.delete(`/matches/${matchId}`);
    } catch (error) {
      throw error;
    }
    setServerMatches((current) => (current ? current.filter((match) => String(match.id) !== String(matchId)) : current));
    setCreatedMatches((current) => current.filter((match) => String(match.id) !== String(matchId)));
    const stored = readCreatedMatches().filter((match) => String(match.id) !== String(matchId));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    return true;
  }

  const value = useMemo(() => ({ matches, createdMatches, createMatch, deleteMatch, refreshMatches, loading, error }), [matches, createdMatches, loading, error]);
  return <MatchDataContext.Provider value={value}>{children}</MatchDataContext.Provider>;
}

export function useMatchData() {
  return useContext(MatchDataContext);
}
