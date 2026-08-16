import {
  createMatch,
  deleteMatch,
  getMatchById,
  getFavorites,
  getMatches,
  getMyMatches,
  getSports,
  joinMatch,
  leaveMatch,
  toggleFavorite,
  updateMatch,
} from '../services/matchService.js';

export async function listFavorites(req, res, next) {
  try {
    res.status(200).json({ matches: await getFavorites(req.user.id) });
  } catch (error) {
    next(error);
  }
}

export async function listSports(req, res, next) {
  try {
    res.status(200).json({ sports: await getSports() });
  } catch (error) {
    next(error);
  }
}

export async function listMatches(req, res, next) {
  try {
    res.status(200).json({ matches: await getMatches(req.validated?.query || req.query) });
  } catch (error) {
    next(error);
  }
}

export async function showMatch(req, res, next) {
  try {
    res.status(200).json({ match: await getMatchById(req.validated.params.id) });
  } catch (error) {
    next(error);
  }
}

export async function storeMatch(req, res, next) {
  try {
    res.status(201).json({ match: await createMatch(req.validated.body, req.user.id) });
  } catch (error) {
    next(error);
  }
}

export async function editMatch(req, res, next) {
  try {
    res.status(200).json({ match: await updateMatch(req.validated.params.id, req.validated.body, req.user) });
  } catch (error) {
    next(error);
  }
}

export async function removeMatch(req, res, next) {
  try {
    res.status(200).json(await deleteMatch(req.validated.params.id, req.user));
  } catch (error) {
    next(error);
  }
}

export async function join(req, res, next) {
  try {
    res.status(201).json({ match: await joinMatch(req.validated.params.id, req.user) });
  } catch (error) {
    next(error);
  }
}

export async function leave(req, res, next) {
  try {
    res.status(200).json(await leaveMatch(req.validated.params.id, req.user));
  } catch (error) {
    next(error);
  }
}

export async function favorite(req, res, next) {
  try {
    res.status(200).json(await toggleFavorite(req.validated.params.id, req.user.id));
  } catch (error) {
    next(error);
  }
}

export async function mine(req, res, next) {
  try {
    res.status(200).json(await getMyMatches(req.user.id));
  } catch (error) {
    next(error);
  }
}

