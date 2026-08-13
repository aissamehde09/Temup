import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { users } from '../data/mockData';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { api } from '../services/api';
import { getAvatarSource } from '../utils/avatar';

const SocialContext = createContext(null);

const seedFriends = [users[1], users[2]];

const seedConversations = [
  {
    id: 'private-3',
    type: 'private',
    participantId: 3,
    name: 'Thomas Dubois',
    context: 'Basket à Nanterre',
    avatar: '/img/avatar-thomas-generated.png',
    time: '10:30',
    unread: 0,
    filter: 'amis',
    online: true,
    messages: [
      { author: 'Thomas', text: 'Toujours OK samedi ?', mine: false, time: '10:28' },
      { author: 'Moi', text: 'Oui, nickel.', mine: true, time: '10:29' },
      { author: 'Thomas', text: 'Super, on sera 7.', mine: false, time: '10:29' },
      { author: 'Moi', text: 'Parfait, à samedi.', mine: true, time: '10:30' },
    ],
  },
  {
    id: 'private-2',
    type: 'private',
    participantId: 2,
    name: 'Sarah Benali',
    context: 'Foot 5 à Puteaux',
    avatar: '/img/avatar-sarah-generated.png',
    time: 'Hier',
    unread: 1,
    filter: 'amis',
    online: false,
    messages: [
      { author: 'Sarah', text: "Merci pour l'invitation.", mine: false, time: '18:12' },
      { author: 'Moi', text: 'Avec plaisir, à dimanche.', mine: true, time: '18:18' },
    ],
  },
  {
    id: 'match-1',
    type: 'match',
    matchId: 1,
    name: 'Basket à Nanterre',
    context: '7 participants',
    avatar: '/img/avatar-mehdi-generated.png',
    time: '17:20',
    unread: 2,
    filter: 'matchs',
    online: true,
    canWrite: true,
    messages: [
      { author: 'Yassine', text: 'J’arriverai vers 19h.', mine: false, time: '17:20' },
      { author: 'Moi', text: 'Ok parfait, à samedi !', mine: true, time: '17:22' },
    ],
  },
];

function storageKey(user, name) {
  return `teamup_${name}_${user?.email || 'guest'}`;
}

function readStoredArray(key, fallback) {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    return Array.isArray(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
}

function nowTime() {
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date());
}

export function SocialProvider({ children }) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const friendsKey = storageKey(user, 'friends');
  const requestsKey = storageKey(user, 'friend_requests');
  const conversationsKey = storageKey(user, 'conversations');

  const [friends, setFriendsState] = useState(() => readStoredArray(friendsKey, seedFriends));
  const [friendRequests, setFriendRequestsState] = useState(() =>
    readStoredArray(requestsKey, [{ id: 'req-3', sender: users[2], status: 'pending', createdAt: 'À l’instant' }]),
  );
  const [conversations, setConversationsState] = useState(() => readStoredArray(conversationsKey, seedConversations));
  const [backendAvailable, setBackendAvailable] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      if (!localStorage.getItem('teamup_token')) return;
      try {
        const { data } = await api.get('/conversations');
        const apiConversations = data.conversations || [];
        const normalizedConversations = apiConversations.map((conversation) => {
          const seed = seedConversations.find((item) =>
            item.id === conversation.id ||
            String(item.participantId) === String(conversation.participantId || conversation.participant_id),
          );
          const merged = { ...seed, ...conversation };
          return {
            ...merged,
            avatar: getAvatarSource({
              id: merged.participantId || merged.participant_id || seed?.participantId,
              name: merged.name || seed?.name,
              avatar: merged.avatar || seed?.avatar,
              avatar_url: merged.avatar_url,
            }),
          };
        });
        setConversationsState(normalizedConversations);
        setBackendAvailable(true);
      } catch {
        setBackendAvailable(false);
      }
    }

    loadConversations();
  }, [user?.id]);

  function setFriends(next) {
    setFriendsState(next);
    localStorage.setItem(friendsKey, JSON.stringify(next));
  }

  function setFriendRequests(next) {
    setFriendRequestsState(next);
    localStorage.setItem(requestsKey, JSON.stringify(next));
  }

  function setConversations(next) {
    setConversationsState(next);
    localStorage.setItem(conversationsKey, JSON.stringify(next));
  }

  function getFriendStatus(playerId) {
    if (friends.some((friend) => String(friend.id) === String(playerId))) return 'friends';
    const request = friendRequests.find((item) => String(item.sender?.id) === String(playerId) || String(item.receiverId) === String(playerId));
    return request?.status || 'none';
  }

  function sendFriendRequest(player) {
    if (!player || getFriendStatus(player.id) !== 'none') return;
    const nextRequest = {
      id: `req-out-${player.id}-${Date.now()}`,
      senderId: user?.id,
      receiverId: player.id,
      receiver: player,
      status: 'pending',
      createdAt: 'À l’instant',
    };
    setFriendRequests([nextRequest, ...friendRequests]);
    addNotification({
      type: 'FRIEND_REQUEST',
      message: `Demande envoyée à ${player.firstName}`,
      context: 'Tu seras notifié dès qu’elle sera acceptée.',
    });
  }

  function acceptFriendRequest(requestId) {
    const request = friendRequests.find((item) => item.id === requestId);
    if (!request?.sender) return;
    const nextFriends = friends.some((friend) => friend.id === request.sender.id) ? friends : [request.sender, ...friends];
    setFriends(nextFriends);
    setFriendRequests(friendRequests.filter((item) => item.id !== requestId));
    addNotification({
      type: 'FRIEND_ACCEPTED',
      message: `${request.sender.firstName} fait maintenant partie de tes amis.`,
      context: 'Tu peux lui envoyer un message.',
    });
  }

  function rejectFriendRequest(requestId) {
    setFriendRequests(friendRequests.filter((item) => item.id !== requestId));
  }

  function normalizePlayer(player) {
    return {
      id: player.id,
      firstName: player.firstName || player.first_name || 'Utilisateur',
      lastName: player.lastName || player.last_name || '',
      city: player.city || '',
      avatar: player.avatar || player.avatar_url || '',
    };
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
      online: true,
      messages: [],
    };
    setConversations([conversation, ...conversations]);
    return conversation.id;
  }

  function markConversationRead(conversationId) {
    setConversations(conversations.map((item) => (item.id === conversationId ? { ...item, unread: 0 } : item)));
  }

  async function sendMessage(conversationId, text) {
    const cleanText = text.trim();
    if (!cleanText) return;
    const conversation = conversations.find((item) => item.id === conversationId);

    if (localStorage.getItem('teamup_token') && backendAvailable && conversation) {
      try {
        const endpoint = conversation.serverId
          ? `/conversations/${conversation.serverId}/messages`
          : `/players/${conversation.participantId}/messages`;
        const { data } = await api.post(endpoint, { content: cleanText });
        setConversations(
          conversations.some((item) => item.id === data.conversation.id)
            ? conversations.map((item) => (item.id === data.conversation.id ? data.conversation : item))
            : [data.conversation, ...conversations.filter((item) => item.id !== conversationId)],
        );
        return;
      } catch {
        setBackendAvailable(false);
      }
    }

    setConversations(
      conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              time: nowTime(),
              messages: [...conversation.messages, { author: 'Moi', text: cleanText, mine: true, time: nowTime() }],
            }
          : conversation,
      ),
    );
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
    }),
    [friends, friendRequests, conversations],
  );

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}

export function useSocial() {
  return useContext(SocialContext);
}
