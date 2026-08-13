import {
  getPublicUser,
  listConversations,
  listFriendRequests,
  listFriends,
  respondFriendRequest,
  sendMessageToConversation,
  sendFriendRequest,
  sendPrivateMessage,
} from '../services/socialService.js';

export async function publicUser(req, res, next) {
  try {
    const player = await getPublicUser(req.params.id, req.user.id);
    res.status(200).json({ player });
  } catch (error) {
    next(error);
  }
}

export async function createFriendRequest(req, res, next) {
  try {
    const result = await sendFriendRequest(req.user.id, Number(req.params.id));
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function friendRequests(req, res, next) {
  try {
    const requests = await listFriendRequests(req.user.id);
    res.status(200).json({ requests });
  } catch (error) {
    next(error);
  }
}

export async function answerFriendRequest(req, res, next) {
  try {
    const result = await respondFriendRequest(req.user.id, Number(req.params.id), req.body.status);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function friends(req, res, next) {
  try {
    const items = await listFriends(req.user.id);
    res.status(200).json({ friends: items });
  } catch (error) {
    next(error);
  }
}

export async function conversations(req, res, next) {
  try {
    const items = await listConversations(req.user.id);
    res.status(200).json({ conversations: items });
  } catch (error) {
    next(error);
  }
}

export async function createConversationMessage(req, res, next) {
  try {
    const conversation = await sendMessageToConversation(req.user.id, Number(req.params.id), req.body.content);
    res.status(201).json({ conversation });
  } catch (error) {
    next(error);
  }
}

export async function createPrivateMessage(req, res, next) {
  try {
    const conversation = await sendPrivateMessage(req.user.id, Number(req.params.id), req.body.content);
    res.status(201).json({ conversation });
  } catch (error) {
    next(error);
  }
}
