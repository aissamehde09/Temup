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

function participantBelongsToUser(participant, user) {
  if (!participant || !user) return false;

  const participantId = participant.user_id ?? participant.userId ?? participant.id;
  const userId = user.user_id ?? user.userId ?? user.id;
  if (participantId != null && userId != null && String(participantId) === String(userId)) {
    return true;
  }

  const participantEmail = String(participant.email || participant.user?.email || '').trim().toLowerCase();
  const userEmail = String(user.email || '').trim().toLowerCase();
  return Boolean(participantEmail && userEmail && participantEmail === userEmail);
}

export function MatchInteractionProvider({ children }) {
  const { user } = useAuth();
  const { matches, refreshMatches } = useMatchData();
  const userKey = user?.email || 'guest';
  const joinedKey = `teamup_joined_matches_${userKey}`;
  const leftKey = `teamup_left_matches_${userKey}`;

  const [joinedIds, setJoinedIds] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [leftIds, setLeftIds] = useState([]);
  const loadedUserKey = useRef(userKey);

  useEffect(() => {
    setJoinedIds(readStoredIds(joinedKey));
    setLeftIds(readStoredIds(leftKey));
    loadedUserKey.current = userKey;
  }, [joinedKey, leftKey, userKey]);

  useEffect(() => {
    if (user) return;
    setJoinedIds([]);
    setLeftIds([]);
    setFavoriteIds([]);
  }, [user]);

  useEffect(() => {
    if (!localStorage.getItem('teamup_token')) {
      setFavoriteIds([]);
      return;
    }
    api.get('/favorites')
      .then(({ data }) => setFavoriteIds((data.matches || []).map((match) => String(match.id))))
      .catch(() => setFavoriteIds([]));
  }, [user?.id]);

  useEffect(() => {
    if (loadedUserKey.current !== userKey) return;
    localStorage.setItem(joinedKey, JSON.stringify(joinedIds));
  }, [joinedIds, joinedKey, userKey]);

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
    const isOrganizer = Boolean(match && match.organizer_id != null && String(match.organizer_id) === currentUserId);
    const alreadyParticipant = Boolean(match?.participants?.some((participant) => (
      (participant.id != null && String(participant.id) === currentUserId)
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

  async function toggleFavorite(matchId) {
    const id = String(matchId);
    const { data } = await api.post(`/matches/${id}/favorite`);
    setFavoriteIds((current) => (
      data.favorite
        ? (current.includes(id) ? current : [...current, id])
        : current.filter((item) => item !== id)
    ));
  }

  const backendJoinedIds = useMemo(() => (
    matches
      .filter((match) => match.participants?.some((participant) => participantBelongsToUser(participant, user)))
      .map((match) => String(match.id))
  ), [matches, user]);

  const effectiveJoinedIds = useMemo(() => (
    [...new Set([...joinedIds, ...backendJoinedIds])].filter((id) => !leftIds.includes(id))
  ), [joinedIds, backendJoinedIds, leftIds]);

  const value = useMemo(() => ({
    joinedIds: effectiveJoinedIds,
    leftIds,
    favoriteIds,
    joinMatch,
    leaveMatch,
    toggleFavorite,
    isJoined: (matchId) => effectiveJoinedIds.includes(String(matchId)),
    isFavorite: (matchId) => favoriteIds.includes(String(matchId)),
  }), [effectiveJoinedIds, leftIds, favoriteIds, matches, user]);

  return (
    <MatchInteractionContext.Provider value={value}>
      {children}
    </MatchInteractionContext.Provider>
  );
}

export function useMatchInteractions() {
  return useContext(MatchInteractionContext);
}
