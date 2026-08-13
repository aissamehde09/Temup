import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { api } from '../services/api';

const MatchInteractionContext = createContext(null);

function readStoredIds(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

export function MatchInteractionProvider({ children }) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const userKey = user?.email || 'guest';
  const joinedKey = `teamup_joined_matches_${userKey}`;
  const favoriteKey = `teamup_favorite_matches_${userKey}`;
  const leftKey = `teamup_left_matches_${userKey}`;

  const [joinedIds, setJoinedIds] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [leftIds, setLeftIds] = useState([]);
  const loadedUserKey = useRef(userKey);

  useEffect(() => {
    setJoinedIds(readStoredIds(joinedKey));
    setFavoriteIds(readStoredIds(favoriteKey));
    setLeftIds(readStoredIds(leftKey));
    loadedUserKey.current = userKey;
  }, [joinedKey, favoriteKey, leftKey]);

  useEffect(() => {
    if (loadedUserKey.current !== userKey) return;
    localStorage.setItem(joinedKey, JSON.stringify(joinedIds));
  }, [joinedIds, joinedKey, userKey]);

  useEffect(() => {
    if (loadedUserKey.current !== userKey) return;
    localStorage.setItem(favoriteKey, JSON.stringify(favoriteIds));
  }, [favoriteIds, favoriteKey, userKey]);

  useEffect(() => {
    if (loadedUserKey.current !== userKey) return;
    localStorage.setItem(leftKey, JSON.stringify(leftIds));
  }, [leftIds, leftKey, userKey]);

  async function joinMatch(matchId) {
    const id = String(matchId);
    if (localStorage.getItem('teamup_token')) {
      const { data } = await api.post(`/matches/${id}/join`);
      setJoinedIds((current) => (current.includes(id) ? current : [...current, id]));
      setLeftIds((current) => current.filter((item) => item !== id));
      return data.match;
    }
    setJoinedIds((current) => (current.includes(id) ? current : [...current, id]));
    setLeftIds((current) => current.filter((item) => item !== id));
    addNotification({ type: 'MATCH_JOINED', message: 'Tu as rejoint un match', context: `Match #${matchId}` });
  }

  async function leaveMatch(matchId) {
    const id = String(matchId);
    if (localStorage.getItem('teamup_token')) {
      await api.delete(`/matches/${id}/leave`);
      setJoinedIds((current) => current.filter((item) => item !== id));
      setLeftIds((current) => (current.includes(id) ? current : [...current, id]));
      return;
    }
    setJoinedIds((current) => current.filter((item) => item !== id));
    setLeftIds((current) => (current.includes(id) ? current : [...current, id]));
    addNotification({ type: 'MATCH_LEFT', message: 'Tu as quitté un match', context: `Match #${matchId}` });
  }

  function toggleFavorite(matchId) {
    const id = String(matchId);
    setFavoriteIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  }

  const value = useMemo(() => ({
    joinedIds,
    leftIds,
    favoriteIds,
    joinMatch,
    leaveMatch,
    toggleFavorite,
    isJoined: (matchId) => joinedIds.includes(String(matchId)),
    isFavorite: (matchId) => favoriteIds.includes(String(matchId)),
  }), [joinedIds, leftIds, favoriteIds]);

  return (
    <MatchInteractionContext.Provider value={value}>
      {children}
    </MatchInteractionContext.Provider>
  );
}

export function useMatchInteractions() {
  return useContext(MatchInteractionContext);
}
