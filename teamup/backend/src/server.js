import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { authRoutes } from './routes/authRoutes.js';
import { matchRoutes } from './routes/matchRoutes.js';
import { notificationRoutes } from './routes/notificationRoutes.js';
import { socialRoutes } from './routes/socialRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { uploadRoutes } from './routes/uploadRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
// Railway doit pouvoir atteindre l'application depuis l'extérieur du conteneur.
const host = process.env.HOST || '0.0.0.0';
function parseOrigins(...values) {
  return values
    .flatMap((value) => String(value || '').split(','))
    .map((value) => value.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

const allowedOrigins = [
  ...parseOrigins(process.env.FRONTEND_URL, process.env.URL_FRONTEND, process.env.VITE_FRONTEND_URL),
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL.replace(/\/+$/, '')}`] : []),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5175',
  'http://127.0.0.1:5175',
];

function isAllowedOrigin(origin) {
  const cleanOrigin = String(origin || '').replace(/\/+$/, '');
  if (!cleanOrigin || allowedOrigins.includes(cleanOrigin)) return true;
  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origine non autorisée par CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'TeamUp API',
  });
});

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', matchRoutes);
app.use('/api', notificationRoutes);
app.use('/api', socialRoutes);
app.use('/api', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route introuvable',
  });
});

app.use(errorMiddleware);

async function startServer() {
  const server = app.listen(port, host, () => {
    console.log(`TeamUp API démarrée sur http://${host}:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Le port ${port} est déjà utilisé. Ferme l’ancien backend ou change PORT dans .env.`);
      return;
    }

    console.error('Erreur serveur:', error);
  });

  // MongoDB est utilisé pour les notifications. Une indisponibilité temporaire
  // ne doit pas empêcher l'API et son endpoint de santé de démarrer.
  if (process.env.MONGODB_URI) {
    mongoose
      .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
      .then(() => console.log('MongoDB connecté'))
      .catch((error) => console.error('MongoDB indisponible, les notifications sont temporairement désactivées:', error.message));
  }
}

startServer();
