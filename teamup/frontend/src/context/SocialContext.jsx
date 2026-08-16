import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';
import { getAvatarSource } from '../utils/avatar';

const SocialContext = createContext(null);

function nowTime() {
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date());
}

function formatRequestDate(value) {
  if (!value) return 'À l’instant';
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function normalizeFriend(raw) {
  return {
    id: raw.id,
    firstName: raw.first_name || raw.firstName || 'Utilisateur',
    lastName: raw.last_name || raw.lastName || '',
    city: raw.city || '',
    avatar: getAvatarSource(raw),
    level: raw.level || '',
  };
}

function normalizeRequest(raw) {
  return {
    id: raw.id,
    status: raw.status || 'pending',
    createdAt: formatRequestDate(raw.created_at),
    sender: normalizeFriend({
      id: raw.sender_id,
      first_name: raw.first_name,
      last_name: raw.last_name,
      avatar_url: raw.avatar_url,
      city: raw.city,
      level: raw.level,
    }),
  };
}

function normalizeConversation(conversation) {
  const participantId = conversation.participantId || conversation.participant_id;

  return {
    ...conversation,
    participantId,
    avatar: getAvatarSource({
      id: participantId,
      name: conversation.name,
      avatar: conversation.avatar,
      avatar_url: conversation.avatar_url,
    }),
    messages: Array.isArray(conversation.messages) ? conversation.messages : [],
  };
}

export function SocialProvider({ children }) {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [pendingOutgoing, setPendingOutgoing] = useState([]);
  const [conversations, setConversations] = useState([]);

  const refreshSocial = useCallback(async () => {
    if (!localStorage.getItem('teamup_token')) return;

    const [friendsRes, requestsRes, conversationsRes] = await Promise.all([
      api.get('/friends'),
      api.get('/friend-requests'),
      api.get('/conversations'),
    ]);

    setFriends((friendsRes.data.friends || []).map(normalizeFriend));
    setFriendRequests((requestsRes.data.requests || []).map(normalizeRequest));
    setConversations((conversationsRes.data.conversations || []).map(normalizeConversation));
  }, []);

  useEffect(() => {
    refreshSocial().catch(() => {
      setFriends([]);
      setFriendRequests([]);
      setConversations([]);
    });
  }, [user?.id, refreshSocial]);

  useEffect(() => {
    if (user) return;
    setPendingOutgoing([]);
  }, [user]);

  function getFriendStatus(playerId) {
    if (friends.some((friend) => String(friend.id) === String(playerId))) return 'friends';
    if (pendingOutgoing.includes(String(playerId))) return 'pending';
    const incoming = friendRequests.find((item) => String(item.sender?.id) === String(playerId));
    if (incoming) return incoming.status;
    return 'none';
  }

  async function sendFriendRequest(player) {
    if (!player || getFriendStatus(player.id) !== 'none') return;
    await api.post(`/players/${player.id}/friend-request`);
    setPendingOutgoing((current) => [...current, String(player.id)]);
    await refreshSocial();
  }

  async function acceptFriendRequest(requestId) {
    await api.put(`/friend-requests/${requestId}`, { status: 'accepted' });
    await refreshSocial();
  }

  async function rejectFriendRequest(requestId) {
    await api.put(`/friend-requests/${requestId}`, { status: 'rejected' });
    await refreshSocial();
  }

  function normalizePlayer(player) {
    return normalizeFriend(player);
  }

  function openPrivateConversation(player) {
    const normalizedPlayer = normalizePlayer(player);
    const existing = conversations.find((conversation) => String(conversation.participantId) === String(normalizedPlayer.id));
    if (existing) return existing.id;

    const conversation = {
      id: `private-${normalizedPlayer.id}`,
      type: 'private',
      participantId: normalizedPlayer.id,
      name: `${normalizedPlayer.firstName} ${normalizedPlayer.lastName}`.trim(),
      context: normalizedPlayer.city || 'Joueur TeamUp',
      avatar: normalizedPlayer.avatar,
      time: nowTime(),
      unread: 0,
      filter: 'amis',
      online: false,
      messages: [],
    };
    setConversations((current) => [conversation, ...current]);
    return conversation.id;
  }

  function markConversationRead(conversationId) {
    setConversations((current) => current.map((item) => (item.id === conversationId ? { ...item, unread: 0 } : item)));
  }

  async function sendMessage(conversationId, text) {
    const cleanText = text.trim();
    if (!cleanText) return;
    const conversation = conversations.find((item) => item.id === conversationId);
    if (!conversation) return;

    const endpoint = conversation.serverId
      ? `/conversations/${conversation.serverId}/messages`
      : `/players/${conversation.participantId}/messages`;
    const { data } = await api.post(endpoint, { content: cleanText });
    const updatedConversation = normalizeConversation(data.conversation);
    setConversations((current) => (
      current.some((item) => item.id === updatedConversation.id)
        ? current.map((item) => (item.id === updatedConversation.id ? updatedConversation : item))
        : [updatedConversation, ...current.filter((item) => item.id !== conversationId)]
    ));
  }

  const value = useMemo(
    () => ({
      friends,
      friendRequests,
      conversations,
      getFriendStatus,
      sendFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      openPrivateConversation,
      markConversationRead,
      sendMessage,
      refreshSocial,
      unreadMessagesCount: conversations.reduce((total, item) => total + Number(item.unread || 0), 0),
    }),
    [friends, friendRequests, conversations, refreshSocial],
  );

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}

export function useSocial() {
  return useContext(SocialContext);
}
