# TeamUp

TeamUp est une plateforme web full-stack pour créer, rechercher, rejoindre et gérer des matchs de basketball ou de football.

Le projet couvre les compétences attendues pour le Titre Professionnel Développeur Web et Web Mobile : interfaces statiques et dynamiques, base relationnelle SQL, base NoSQL, API REST, logique métier serveur, authentification et sécurisation.

## Fonctionnalités

- Inscription et connexion avec JWT
- Hash des mots de passe avec bcrypt
- Profil sportif utilisateur
- Recherche et filtrage des matchs
- Détail d’un match
- Création, modification et suppression de match
- Rejoindre ou quitter un match
- Gestion des participations et matchs organisés
- Favoris
- Notifications MongoDB
- Middleware d’authentification et contrôles d’autorisation
- Validation serveur avec Zod
- Frontend React responsive, desktop-first

## Stack technique

- Frontend : React, Vite, JavaScript, Tailwind CSS, React Router, Axios
- Backend : Node.js, Express.js
- SQL : MySQL, utilisable avec phpMyAdmin
- NoSQL : MongoDB, Mongoose
- Sécurité : JWT, bcrypt, validation serveur, middleware auth, autorisations
- Outils : Git, GitHub, Postman, dotenv

## Architecture

```txt
teamup/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── models/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
├── README.md
└── .gitignore
```

## Installation

```bash
cd teamup/frontend
npm install

cd ../backend
npm install
```

## Variables d’environnement backend

Copier le fichier :

```bash
cd teamup/backend
copy .env.example .env
```

Exemple :

```env
PORT=5000
MYSQL_HOST="localhost"
MYSQL_PORT=3306
MYSQL_USER="root"
MYSQL_PASSWORD=""
MYSQL_DATABASE="teamup"
MONGODB_URI="mongodb://localhost:27017/teamup"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
```

## Configuration MySQL avec phpMyAdmin

1. Ouvrir phpMyAdmin.
2. Importer le fichier `backend/database/schema.sql`.
3. Importer ensuite `backend/database/seed.sql`.

Les tables créées :

- users
- sports
- user_sports
- matches
- participations
- favorites
- reviews

## Configuration MongoDB

MongoDB stocke les notifications dans la collection `notifications`.

Exemple de document :

```json
{
  "userId": 15,
  "type": "MATCH_JOINED",
  "message": "Thomas a rejoint ton match",
  "read": false,
  "createdAt": "2026-08-07T10:00:00Z"
}
```

## Lancement backend

```bash
cd teamup/backend
npm run dev
```

Test santé :

```bash
http://localhost:5000/api/health
```

## Lancement frontend

```bash
cd teamup/frontend
npm run dev
```

URL :

```bash
http://localhost:5173
```

## Routes API principales

Auth :

- `POST /api/auth/register`
- `POST /api/auth/login`

Utilisateur :

- `GET /api/users/me`
- `PUT /api/users/me`

Sports et matchs :

- `GET /api/sports`
- `GET /api/matches`
- `GET /api/matches/:id`
- `POST /api/matches`
- `PUT /api/matches/:id`
- `DELETE /api/matches/:id`
- `POST /api/matches/:id/join`
- `DELETE /api/matches/:id/leave`
- `POST /api/matches/:id/favorite`
- `GET /api/my-matches`

Notifications :

- `GET /api/notifications`
- `PUT /api/notifications/:id/read`

## Comptes de démonstration

Les comptes seed utilisent ces emails :

- `mehdi@teamup.local`
- `alex@teamup.local`
- `sarah@teamup.local`
- `thomas@teamup.local`

Mot de passe de démonstration prévu dans les seeds : `password123`

## Captures d’écran

À ajouter après lancement local :

- Accueil
- Recherche des matchs
- Détail d’un match
- Dashboard

## Auteur

Mehdi — Projet TeamUp.
