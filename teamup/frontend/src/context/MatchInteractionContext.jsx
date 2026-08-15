import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { useMatchData } from './MatchDataContext';
import { api } from '../services/api';
import { isPastMatch } from '../utils/matchDate';
import { normalizeMatch } from '../utils/matchNormalize';

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
  const { matches, refreshMatches } = useMatchData();
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
    const token = localStorage.getItem('teamup_token');
    if (!token) throw new Error('Connecte-toi pour rejoindre ce match.');

    const match = matches.find((item) => String(item.id) === id);
    const currentUserId = String(user?.id || '');
    const currentUserEmail = String(user?.email || '').toLowerCase();
    const isOrganizer = Boolean(match && (
      (match.organizer_id != null && String(match.organizer_id) === currentUserId)
      || (match.organizer_email && String(match.organizer_email).toLowerCase() === currentUserEmail)
    ));
    const alreadyParticipant = Boolean(match?.participants?.some((participant) => (
      (participant.id != null && String(participant.id) === currentUserId)
      || (participant.email && String(participant.email).toLowerCase() === currentUserEmail)
    )));

    if (isOrganizer) throw new Error('Tu ne peux pas rejoindre ton propre match.');
    if (match && isPastMatch(match)) throw new Error('Impossible de rejoindre un match passé.');
    if (match && Number(match.players_count) >= Number(match.max_players)) throw new Error('Ce match est complet.');
    if (alreadyParticipant || joinedIds.includes(id)) throw new Error('Tu es déjà inscrit à ce match.');

    const { data } = await api.post(`/matches/${id}/join`);
    setJoinedIds((current) => (current.includes(id) ? current : [...current, id]));
    setLeftIds((current) => current.filter((item) => item !== id));
    refreshMatches();
    return data.match ? normalizeMatch(data.match) : null;
  }

  async function leaveMatch(matchId) {
    const id = String(matchId);
    const token = localStorage.getItem('teamup_token');
    if (!token) throw new Error('Connecte-toi pour quitter ce match.');
    const { data } = await api.delete(`/matches/${id}/leave`);
    setJoinedIds((current) => current.filter((item) => item !== id));
    setLeftIds((current) => (current.includes(id) ? current : [...current, id]));
    refreshMatches();
    return data.match ? normalizeMatch(data.match) : null;
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
  }), [joinedIds, leftIds, favoriteIds, matches, user]);

  return (
    <MatchInteractionContext.Provider value={value}>
      {children}
    </MatchInteractionContext.Provider>
  );
}

export function useMatchInteractions() {
  return useContext(MatchInteractionContext);
}
