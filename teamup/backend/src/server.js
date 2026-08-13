import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { authRoutes } from './routes/authRoutes.js';
import { matchRoutes } from './routes/matchRoutes.js';
import { notificationRoutes } from './routes/notificationRoutes.js';
import { socialRoutes } from './routes/socialRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || '127.0.0.1';
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5175',
  'http://127.0.0.1:5175',
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origine non autorisée par CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '8mb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'TeamUp API',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', matchRoutes);
app.use('/api', notificationRoutes);
app.use('/api', socialRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route introuvable',
  });
});

app.use(errorMiddleware);

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connecté');
    }

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
  } catch (error) {
    console.error('Impossible de démarrer le serveur', error);
    process.exit(1);
  }
}

startServer();
