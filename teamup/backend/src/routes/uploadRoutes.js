import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth } from '../middleware/authMiddleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  },
});

export const uploadRoutes = Router();

uploadRoutes.post('/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier uploadé' });
  }
  // On renvoie l'URL relative de l'image
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});
