import { query } from '../utils/db.js';
import { HttpError } from '../utils/httpError.js';
import { sanitizeUser } from '../utils/sanitize.js';

export async function getPublicUser(userId, currentUserId) {
  const users = await query('SELECT * FROM users WHERE id = :userId', { userId });
  if (!users.length) throw new HttpError(404, 'Joueur introuvable');

  const sports = await query(
    `SELECT s.id, s.name, s.slug
     FROM sports s
     INNER JOIN user_sports us ON us.sport_id = s.id
     WHERE us.user_id = :userId
     ORDER BY s.name`,
    { userId },
  );

  const stats = await query(
    `SELECT
      (SELECT COUNT(*) FROM participations WHERE user_id = :userId AND status = 'CONFIRMED') AS played_count,
      (SELECT COALESCE(ROUND(AVG(rating), 1), 0) FROM reviews WHERE reviewed_user_id = :userId) AS average_rating`,
    { userId },
  );

  const friendship = await query(
    `SELECT id FROM friendships
     WHERE (user1_id = LEAST(:currentUserId, :userId) AND user2_id = GREATEST(:currentUserId, :userId))`,
    { currentUserId, userId },
  );

  const requests = await query(
    `SELECT status FROM friend_requests
     WHERE (sender_id = :currentUserId AND receiver_id = :userId)
        OR (sender_id = :userId AND receiver_id = :currentUserId)
     ORDER BY id DESC
     LIMIT 1`,
    { currentUserId, userId },
  );

  return {
    ...sanitizeUser(users[0]),
    sports,
    stats: stats[0],
    friendStatus: friendship.length ? 'friends' : requests[0]?.status || 'none',
  };
}

export async function sendFriendRequest(senderId, receiverId) {
  if (String(senderId) === String(receiverId)) throw new HttpError(400, 'Impossible de t’ajouter toi-même');

  const users = await query('SELECT id FROM users WHERE id = :receiverId', { receiverId });
  if (!users.length) throw new HttpError(404, 'Utilisateur introuvable');

  const existingFriendship = await query(
    `SELECT id FROM friendships
     WHERE user1_id = LEAST(:senderId, :receiverId)
       AND user2_id = GREATEST(:senderId, :receiverId)`,
    { senderId, receiverId },
  );
  if (existingFriendship.length) throw new HttpError(409, 'Vous êtes déjà amis');

  const existingRequest = await query(
    `SELECT id, status FROM friend_requests
     WHERE sender_id = :senderId AND receiver_id = :receiverId`,
    { senderId, receiverId },
  );
  if (existingRequest.length && existingRequest[0].status === 'pending') throw new HttpError(409, 'Demande déjà envoyée');

  await query(
    `INSERT INTO friend_requests (sender_id, receiver_id, status)
     VALUES (:senderId, :receiverId, 'pending')
     ON DUPLICATE KEY UPDATE status = 'pending', updated_at = CURRENT_TIMESTAMP`,
    { senderId, receiverId },
  );

  return { status: 'pending' };
}

export async function listFriendRequests(userId) {
  return query(
    `SELECT fr.id, fr.status, fr.created_at, u.id AS sender_id, u.first_name, u.last_name, u.avatar_url, u.city, u.level
     FROM friend_requests fr
     INNER JOIN users u ON u.id = fr.sender_id
     WHERE fr.receiver_id = :userId AND fr.status = 'pending'
     ORDER BY fr.created_at DESC`,
    { userId },
  );
}

export async function respondFriendRequest(userId, requestId, status) {
  const requests = await query('SELECT * FROM friend_requests WHERE id = :requestId AND receiver_id = :userId', { requestId, userId });
  if (!requests.length) throw new HttpError(404, 'Demande introuvable');
  if (!['accepted', 'rejected'].includes(status)) throw new HttpError(400, 'Statut invalide');

  await query('UPDATE friend_requests SET status = :status WHERE id = :requestId', { requestId, status });

  if (status === 'accepted') {
    const user1Id = Math.min(Number(requests[0].sender_id), Number(requests[0].receiver_id));
    const user2Id = Math.max(Number(requests[0].sender_id), Number(requests[0].receiver_id));
    await query(
      `INSERT IGNORE INTO friendships (user1_id, user2_id)
       VALUES (:user1Id, :user2Id)`,
      { user1Id, user2Id },
    );
  }

  return { status };
}

export async function listFriends(userId) {
  return query(
    `SELECT u.id, u.first_name, u.last_name, u.avatar_url, u.city, u.level
     FROM friendships f
     INNER JOIN users u ON u.id = IF(f.user1_id = :userId, f.user2_id, f.user1_id)
     WHERE f.user1_id = :userId OR f.user2_id = :userId
     ORDER BY u.first_name`,
    { userId },
  );
}

export async function listConversations(userId) {
  const conversations = await query(
    `SELECT
      c.id,
      c.type,
      c.match_id,
      c.created_at,
      m.title AS match_title,
      other_user.id AS participant_id,
      other_user.first_name,
      other_user.last_name,
      other_user.avatar_url,
      other_user.city,
      (
        SELECT COUNT(*)
        FROM messages unread_messages
        WHERE unread_messages.conversation_id = c.id
          AND unread_messages.sender_id <> :userId
          AND unread_messages.read_at IS NULL
      ) AS unread_count,
      (
        SELECT latest.created_at
        FROM messages latest
        WHERE latest.conversation_id = c.id
        ORDER BY latest.created_at DESC
        LIMIT 1
      ) AS last_message_at
     FROM conversations c
     INNER JOIN conversation_participants mine
       ON mine.conversation_id = c.id AND mine.user_id = :userId
     LEFT JOIN conversation_participants other_participant
       ON other_participant.conversation_id = c.id AND other_participant.user_id <> :userId
     LEFT JOIN users other_user ON other_user.id = other_participant.user_id
     LEFT JOIN matches m ON m.id = c.match_id
     ORDER BY COALESCE(last_message_at, c.created_at) DESC`,
    { userId },
  );

  return Promise.all(conversations.map(async (conversation) => {
    const messages = await query(
      `SELECT msg.id, msg.content, msg.created_at, msg.sender_id, u.first_name, u.last_name
       FROM messages msg
       INNER JOIN users u ON u.id = msg.sender_id
       WHERE msg.conversation_id = :conversationId
       ORDER BY msg.created_at ASC`,
      { conversationId: conversation.id },
    );

    return formatConversation(conversation, messages, userId);
  }));
}

export async function sendMessageToConversation(userId, conversationId, content) {
  const cleanContent = String(content || '').trim();
  if (!cleanContent) throw new HttpError(400, 'Message vide');

  const access = await query(
    `SELECT conversation_id
     FROM conversation_participants
     WHERE conversation_id = :conversationId AND user_id = :userId`,
    { conversationId, userId },
  );
  if (!access.length) throw new HttpError(403, 'Conversation non autorisée');

  await query(
    `INSERT INTO messages (conversation_id, sender_id, content)
     VALUES (:conversationId, :senderId, :content)`,
    { conversationId, senderId: userId, content: cleanContent },
  );

  return getConversationForUser(userId, conversationId);
}

export async function sendPrivateMessage(userId, receiverId, content) {
  if (String(userId) === String(receiverId)) throw new HttpError(400, 'Impossible de t’envoyer un message à toi-même');
  const receiver = await query('SELECT id FROM users WHERE id = :receiverId', { receiverId });
  if (!receiver.length) throw new HttpError(404, 'Utilisateur introuvable');

  const conversationId = await getOrCreatePrivateConversation(userId, receiverId);
  return sendMessageToConversation(userId, conversationId, content);
}

async function getOrCreatePrivateConversation(userId, receiverId) {
  const existing = await query(
    `SELECT cp1.conversation_id AS id
     FROM conversation_participants cp1
     INNER JOIN conversation_participants cp2 ON cp2.conversation_id = cp1.conversation_id
     INNER JOIN conversations c ON c.id = cp1.conversation_id
     WHERE c.type = 'private'
       AND cp1.user_id = :userId
       AND cp2.user_id = :receiverId
     LIMIT 1`,
    { userId, receiverId },
  );
  if (existing.length) return existing[0].id;

  const result = await query('INSERT INTO conversations (type) VALUES ("private")');
  await query(
    `INSERT INTO conversation_participants (conversation_id, user_id)
     VALUES (:conversationId, :userId), (:conversationId, :receiverId)`,
    { conversationId: result.insertId, userId, receiverId },
  );
  return result.insertId;
}

async function getConversationForUser(userId, conversationId) {
  const conversations = await query(
    `SELECT
      c.id,
      c.type,
      c.match_id,
      c.created_at,
      m.title AS match_title,
      other_user.id AS participant_id,
      other_user.first_name,
      other_user.last_name,
      other_user.avatar_url,
      other_user.city,
      0 AS unread_count
     FROM conversations c
     INNER JOIN conversation_participants mine
       ON mine.conversation_id = c.id AND mine.user_id = :userId
     LEFT JOIN conversation_participants other_participant
       ON other_participant.conversation_id = c.id AND other_participant.user_id <> :userId
     LEFT JOIN users other_user ON other_user.id = other_participant.user_id
     LEFT JOIN matches m ON m.id = c.match_id
     WHERE c.id = :conversationId
     LIMIT 1`,
    { userId, conversationId },
  );
  if (!conversations.length) throw new HttpError(404, 'Conversation introuvable');

  const messages = await query(
    `SELECT msg.id, msg.content, msg.created_at, msg.sender_id, u.first_name, u.last_name
     FROM messages msg
     INNER JOIN users u ON u.id = msg.sender_id
     WHERE msg.conversation_id = :conversationId
     ORDER BY msg.created_at ASC`,
    { conversationId },
  );

  return formatConversation(conversations[0], messages, userId);
}

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
