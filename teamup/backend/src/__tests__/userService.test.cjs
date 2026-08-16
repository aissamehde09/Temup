const { describe, it, expect } = require('@jest/globals');

// Replicate sanitizeUser logic
function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

// Replicate socialService logic
function formatConversation(conversation, messages, userId) {
  const isPrivate = conversation.type === 'private';
  const name = isPrivate
    ? `${conversation.first_name || 'Utilisateur'} ${conversation.last_name || ''}`.trim()
    : conversation.match_title || 'Conversation match';

  return {
    id: `server-${conversation.id}`,
    serverId: conversation.id,
    type: conversation.type,
    participantId: conversation.participant_id,
    name,
    context: isPrivate ? conversation.city || 'Joueur TeamUp' : 'Conversation de match',
    avatar: conversation.avatar_url || '',
    time: formatTime(messages.at(-1)?.created_at || conversation.created_at),
    unread: Number(conversation.unread_count || 0),
    filter: isPrivate ? 'amis' : 'matchs',
    online: false,
    canWrite: true,
    messages: messages.map((message) => ({
      id: message.id,
      author: message.sender_id === userId ? 'Moi' : message.first_name,
      text: message.content,
      mine: message.sender_id === userId,
      time: formatTime(message.created_at),
    })),
  };
}

function formatTime(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

describe('userService - sanitizeUser', () => {
  const userWithPassword = {
    id: 1,
    first_name: 'Mehdi',
    last_name: 'Ait',
    email: 'mehdi@teamup.local',
    password_hash: '$2b$10$hashedpassword',
    city: 'Nanterre',
  };

  it('removes password_hash from user object', () => {
    const result = sanitizeUser(userWithPassword);
    expect(result).not.toHaveProperty('password_hash');
  });

  it('preserves all other fields', () => {
    const result = sanitizeUser(userWithPassword);
    expect(result.id).toBe(1);
    expect(result.first_name).toBe('Mehdi');
    expect(result.email).toBe('mehdi@teamup.local');
  });

  it('returns null for null input', () => {
    expect(sanitizeUser(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(sanitizeUser(undefined)).toBeNull();
  });

  it('handles user without password_hash', () => {
    const user = { id: 1, name: 'Test' };
    const result = sanitizeUser(user);
    expect(result).toEqual({ id: 1, name: 'Test' });
  });
});

describe('socialService - formatConversation', () => {
  const baseConversation = {
    id: 1,
    type: 'private',
    match_id: null,
    created_at: '2026-01-01T10:00:00Z',
    participant_id: 2,
    first_name: 'Alex',
    last_name: 'Martin',
    avatar_url: '/img/avatar.png',
    city: 'Puteaux',
    unread_count: 2,
  };

  const baseMessages = [
    { id: 1, content: 'Salut!', created_at: '2026-01-01T10:00:00Z', sender_id: 2, first_name: 'Alex', last_name: 'Martin' },
    { id: 2, content: 'Ca va?', created_at: '2026-01-01T10:01:00Z', sender_id: 1, first_name: 'Mehdi', last_name: 'Ait' },
  ];

  it('formats private conversation with correct name', () => {
    const result = formatConversation(baseConversation, baseMessages, 1);
    expect(result.name).toBe('Alex Martin');
    expect(result.type).toBe('private');
    expect(result.filter).toBe('amis');
  });

  it('formats match conversation with match title', () => {
    const matchConvo = { ...baseConversation, type: 'match', match_title: 'Basket à Nanterre' };
    const result = formatConversation(matchConvo, baseMessages, 1);
    expect(result.name).toBe('Basket à Nanterre');
    expect(result.filter).toBe('matchs');
  });

  it('marks own messages as mine', () => {
    const result = formatConversation(baseConversation, baseMessages, 1);
    expect(result.messages[0].mine).toBe(false);
    expect(result.messages[1].mine).toBe(true);
  });

  it('uses "Moi" for own messages author', () => {
    const result = formatConversation(baseConversation, baseMessages, 1);
    expect(result.messages[0].author).toBe('Alex');
    expect(result.messages[1].author).toBe('Moi');
  });

  it('sets unread count', () => {
    const result = formatConversation(baseConversation, baseMessages, 1);
    expect(result.unread).toBe(2);
  });

  it('formats server ID correctly', () => {
    const result = formatConversation(baseConversation, baseMessages, 1);
    expect(result.id).toBe('server-1');
    expect(result.serverId).toBe(1);
  });

  it('handles empty messages', () => {
    const result = formatConversation(baseConversation, [], 1);
    expect(result.messages).toEqual([]);
  });

  it('falls back to "Utilisateur" when first_name is missing', () => {
    const convo = { ...baseConversation, first_name: null };
    const result = formatConversation(convo, baseMessages, 1);
    expect(result.name).toBe('Utilisateur Martin');
  });

  it('uses city as context for private conversations', () => {
    const result = formatConversation(baseConversation, baseMessages, 1);
    expect(result.context).toBe('Puteaux');
  });

  it('falls back to "Joueur TeamUp" when city is missing', () => {
    const convo = { ...baseConversation, city: null };
    const result = formatConversation(convo, baseMessages, 1);
    expect(result.context).toBe('Joueur TeamUp');
  });

  it('handles match conversation context', () => {
    const convo = { ...baseConversation, type: 'match' };
    const result = formatConversation(convo, baseMessages, 1);
    expect(result.context).toBe('Conversation de match');
  });

  it('defaults unread to 0 when unread_count is null', () => {
    const convo = { ...baseConversation, unread_count: null };
    const result = formatConversation(convo, baseMessages, 1);
    expect(result.unread).toBe(0);
  });

  it('always sets canWrite to true', () => {
    const result = formatConversation(baseConversation, baseMessages, 1);
    expect(result.canWrite).toBe(true);
  });

  it('always sets online to false', () => {
    const result = formatConversation(baseConversation, baseMessages, 1);
    expect(result.online).toBe(false);
  });
});

describe('socialService - formatTime', () => {
  it('formats valid date', () => {
    const result = formatTime('2026-01-01T14:30:00Z');
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it('returns empty string for null', () => {
    expect(formatTime(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatTime(undefined)).toBe('');
  });
});
