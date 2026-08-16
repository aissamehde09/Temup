-- =====================================================
-- TEAMUP — Fichier SQL complet (schéma + seed)
-- Base de données : MySQL / MariaDB
-- =====================================================

CREATE DATABASE IF NOT EXISTS teamup CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE teamup;

-- =====================================================
-- 1. SUPPRESSION DES TABLES EXISTANTES (ordre inverse des dépendances)
-- =====================================================

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversation_participants;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS friend_requests;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS participations;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS user_sports;
DROP TABLE IF EXISTS sports;
DROP TABLE IF EXISTS users;

-- =====================================================
-- 2. TABLE : users
-- =====================================================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  city VARCHAR(120) NOT NULL,
  level ENUM('Débutant', 'Intermédiaire', 'Confirmé') NOT NULL DEFAULT 'Débutant',
  role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  avatar_url LONGTEXT NULL,
  bio TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_city (city)
);

-- =====================================================
-- 3. TABLE : sports
-- =====================================================

CREATE TABLE sports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(80) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. TABLE : user_sports (association users ↔ sports)
-- =====================================================

CREATE TABLE user_sports (
  user_id INT NOT NULL,
  sport_id INT NOT NULL,
  PRIMARY KEY (user_id, sport_id),
  CONSTRAINT fk_user_sports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_sports_sport FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE
);

-- =====================================================
-- 5. TABLE : matches
-- =====================================================

CREATE TABLE matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sport_id INT NOT NULL,
  organizer_id INT NOT NULL,
  title VARCHAR(160) NOT NULL,
  city VARCHAR(120) NOT NULL,
  location VARCHAR(180) NOT NULL,
  address VARCHAR(255) NULL,
  match_date DATE NOT NULL,
  match_time TIME NOT NULL,
  level ENUM('Débutant', 'Intermédiaire', 'Confirmé') NOT NULL,
  max_players INT NOT NULL,
  description TEXT NULL,
  image_url LONGTEXT NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_matches_sport FOREIGN KEY (sport_id) REFERENCES sports(id),
  CONSTRAINT fk_matches_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_max_players CHECK (max_players BETWEEN 2 AND 30),
  INDEX idx_matches_date_time (match_date, match_time),
  INDEX idx_matches_sport (sport_id),
  INDEX idx_matches_organizer (organizer_id),
  INDEX idx_matches_city (city),
  INDEX idx_matches_level (level)
);

-- =====================================================
-- 6. TABLE : participations
-- =====================================================

CREATE TABLE participations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  match_id INT NOT NULL,
  status ENUM('CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_active_participation (user_id, match_id),
  CONSTRAINT fk_participations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_participations_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  INDEX idx_participations_match (match_id),
  INDEX idx_participations_user (user_id)
);

-- =====================================================
-- 7. TABLE : favorites
-- =====================================================

CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  match_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favorite (user_id, match_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  INDEX idx_favorites_user (user_id)
);

-- =====================================================
-- 8. TABLE : friend_requests
-- =====================================================

CREATE TABLE friend_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_friend_request (sender_id, receiver_id),
  CONSTRAINT fk_friend_requests_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_friend_requests_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_friend_request_not_self CHECK (sender_id <> receiver_id),
  INDEX idx_friend_requests_receiver (receiver_id),
  INDEX idx_friend_requests_sender (sender_id)
);

-- =====================================================
-- 9. TABLE : friendships
-- =====================================================

CREATE TABLE friendships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_friendship (user1_id, user2_id),
  CONSTRAINT fk_friendships_user1 FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_friendships_user2 FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_friendship_not_self CHECK (user1_id <> user2_id),
  INDEX idx_friendships_user2 (user2_id)
);

-- =====================================================
-- 10. TABLE : conversations
-- =====================================================

CREATE TABLE conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('private', 'match') NOT NULL,
  match_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_conversations_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

-- =====================================================
-- 11. TABLE : conversation_participants
-- =====================================================

CREATE TABLE conversation_participants (
  conversation_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (conversation_id, user_id),
  CONSTRAINT fk_conversation_participants_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_conversation_participants_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_conversation_participants_user (user_id)
);

-- =====================================================
-- 12. TABLE : messages
-- =====================================================

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_messages_conversation (conversation_id),
  INDEX idx_messages_sender (sender_id)
);

-- =====================================================
-- 13. TABLE : reviews
-- =====================================================

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reviewer_id INT NOT NULL,
  reviewed_user_id INT NOT NULL,
  match_id INT NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_review (reviewer_id, reviewed_user_id, match_id),
  CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_reviewed_user FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
  INDEX idx_reviews_reviewed_user (reviewed_user_id)
);

-- =====================================================
-- 14. SEED : Sports
-- =====================================================

INSERT INTO sports (name, slug) VALUES
('Basketball', 'basketball'),
('Football', 'football');

-- =====================================================
-- 15. SEED : Utilisateurs démo
--     Mot de passe pour tous : password123
-- =====================================================

INSERT INTO users (first_name, last_name, email, password_hash, city, level, role, avatar_url) VALUES
('Mehdi', 'Ait', 'mehdi@teamup.local', '$2b$10$yxT8DPM2XJ2XIrBwD06zyely6PWRVGPygWJadVZo9.OIo/66wG5Ga', 'Nanterre', 'Intermédiaire', 'ADMIN', '/img/avatar-mehdi-generated.png'),
('Alex', 'Martin', 'alex@teamup.local', '$2b$10$yxT8DPM2XJ2XIrBwD06zyely6PWRVGPygWJadVZo9.OIo/66wG5Ga', 'Puteaux', 'Débutant', 'USER', '/img/avatar-alex-generated.png'),
('Sarah', 'Benali', 'sarah@teamup.local', '$2b$10$yxT8DPM2XJ2XIrBwD06zyely6PWRVGPygWJadVZo9.OIo/66wG5Ga', 'Courbevoie', 'Confirmé', 'USER', '/img/avatar-sarah-generated.png'),
('Thomas', 'Dubois', 'thomas@teamup.local', '$2b$10$yxT8DPM2XJ2XIrBwD06zyely6PWRVGPygWJadVZo9.OIo/66wG5Ga', 'Levallois', 'Intermédiaire', 'USER', '/img/avatar-thomas-generated.png')
ON DUPLICATE KEY UPDATE
  first_name = VALUES(first_name),
  last_name = VALUES(last_name),
  password_hash = VALUES(password_hash),
  city = VALUES(city),
  level = VALUES(level),
  role = VALUES(role),
  avatar_url = VALUES(avatar_url);

-- =====================================================
-- 16. SEED : Sports des utilisateurs
-- =====================================================

INSERT IGNORE INTO user_sports (user_id, sport_id)
SELECT u.id, s.id FROM users u JOIN sports s ON s.slug IN ('basketball', 'football') WHERE u.email = 'mehdi@teamup.local';

INSERT IGNORE INTO user_sports (user_id, sport_id)
SELECT u.id, s.id FROM users u JOIN sports s ON s.slug = 'football' WHERE u.email = 'alex@teamup.local';

INSERT IGNORE INTO user_sports (user_id, sport_id)
SELECT u.id, s.id FROM users u JOIN sports s ON s.slug = 'basketball' WHERE u.email = 'sarah@teamup.local';

INSERT IGNORE INTO user_sports (user_id, sport_id)
SELECT u.id, s.id FROM users u JOIN sports s ON s.slug IN ('basketball', 'football') WHERE u.email = 'thomas@teamup.local';

-- =====================================================
-- 17. SEED : Matchs démo
-- =====================================================

INSERT INTO matches (sport_id, organizer_id, title, city, location, address, match_date, match_time, level, max_players, description, image_url)
SELECT s.id, u.id, 'Basket à Nanterre', 'Nanterre', 'Terrain extérieur Nanterre', 'Rue des Vignes, 92000 Nanterre', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '16:00:00', 'Intermédiaire', 10, 'Match convivial sur terrain extérieur. Bonne ambiance et respect du niveau.', '/img/teamup-basketball-original.png'
FROM sports s JOIN users u ON u.email = 'mehdi@teamup.local'
WHERE s.slug = 'basketball' AND NOT EXISTS (SELECT 1 FROM matches m WHERE m.title = 'Basket à Nanterre' AND m.city = 'Nanterre');

INSERT INTO matches (sport_id, organizer_id, title, city, location, address, match_date, match_time, level, max_players, description, image_url)
SELECT s.id, u.id, 'Foot 5 à Puteaux', 'Puteaux', 'Stade de Puteaux', 'Île de Puteaux, 92800 Puteaux', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '11:00:00', 'Débutant', 12, 'Foot 5 ouvert aux débutants. Pense à prendre une bouteille d''eau.', '/img/teamup-football-original.png'
FROM sports s JOIN users u ON u.email = 'alex@teamup.local'
WHERE s.slug = 'football' AND NOT EXISTS (SELECT 1 FROM matches m WHERE m.title = 'Foot 5 à Puteaux' AND m.city = 'Puteaux');

INSERT INTO matches (sport_id, organizer_id, title, city, location, address, match_date, match_time, level, max_players, description, image_url)
SELECT s.id, u.id, 'Basket à Courbevoie', 'Courbevoie', 'Gymnase Jean-Pierre Rives', '91 Boulevard de Verdun, 92400 Courbevoie', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '19:00:00', 'Confirmé', 10, 'Session intense pour joueurs réguliers.', '/img/teamup-basketball-gym-original.png'
FROM sports s JOIN users u ON u.email = 'sarah@teamup.local'
WHERE s.slug = 'basketball' AND NOT EXISTS (SELECT 1 FROM matches m WHERE m.title = 'Basket à Courbevoie' AND m.city = 'Courbevoie');

INSERT INTO matches (sport_id, organizer_id, title, city, location, address, match_date, match_time, level, max_players, description, image_url)
SELECT s.id, u.id, 'Football à Levallois', 'Levallois', 'Parc des Sports', '33 Rue Baudin, 92300 Levallois', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '20:00:00', 'Intermédiaire', 14, 'Match équilibré, esprit fair-play demandé.', '/img/teamup-football-night-original.png'
FROM sports s JOIN users u ON u.email = 'thomas@teamup.local'
WHERE s.slug = 'football' AND NOT EXISTS (SELECT 1 FROM matches m WHERE m.title = 'Football à Levallois' AND m.city = 'Levallois');

-- =====================================================
-- 18. SEED : Participations aux matchs
-- =====================================================

INSERT IGNORE INTO participations (user_id, match_id)
SELECT u.id, m.id FROM users u JOIN matches m ON m.title = 'Basket à Nanterre' AND m.city = 'Nanterre'
WHERE u.email IN ('alex@teamup.local', 'sarah@teamup.local', 'thomas@teamup.local');

INSERT IGNORE INTO participations (user_id, match_id)
SELECT u.id, m.id FROM users u JOIN matches m ON m.title = 'Foot 5 à Puteaux' AND m.city = 'Puteaux'
WHERE u.email IN ('mehdi@teamup.local', 'sarah@teamup.local', 'thomas@teamup.local');

INSERT IGNORE INTO participations (user_id, match_id)
SELECT u.id, m.id FROM users u JOIN matches m ON m.title = 'Basket à Courbevoie' AND m.city = 'Courbevoie'
WHERE u.email IN ('mehdi@teamup.local', 'alex@teamup.local');
