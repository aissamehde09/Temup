export function errorMiddleware(error, req, res, next) {
  const status = error.status || (error.code === 'ER_DATA_TOO_LONG' || error.code === 'ER_BAD_FIELD_ERROR' ? 400 : 500);
  let message = error.message;
  if (error.code === 'ER_DATA_TOO_LONG') message = 'La photo est trop volumineuse pour la base. Exécute la migration image_url LONGTEXT dans phpMyAdmin.';
  if (error.code === 'ER_BAD_FIELD_ERROR') message = 'La base TeamUp n\'est pas à jour. Ajoute les colonnes latitude et longitude dans phpMyAdmin.';
  if (!message) message = 'Erreur serveur';

  if (status === 500) {
    console.error(error);
    if (process.env.NODE_ENV === 'production') {
      message = 'Erreur serveur interne';
    }
  }

  res.status(status).json({ message });
}
