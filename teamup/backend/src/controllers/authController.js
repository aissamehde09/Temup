import { loginUser, registerUser } from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const result = await registerUser(req.validated.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.validated.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

