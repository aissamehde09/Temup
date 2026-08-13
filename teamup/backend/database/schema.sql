CREATE DATABASE IF NOT EXISTS teamup CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE teamup;

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS participations;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS user_sports;
DROP TABLE IF EXISTS sports;
DROP TABLE IF EXISTS users;

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
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(80) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sports (
  user_id INT NOT NULL,
  sport_id INT NOT NULL,
  PRIMARY KEY (user_id, sport_id),
  CONSTRAINT fk_user_sports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_sports_sport FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE
);

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
  CONSTRAINT chk_max_players CHECK (max_players BETWEEN 2 AND 30)
);

CREATE TABLE participations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  match_id INT NOT NULL,
  status ENUM('CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_active_participation (user_id, match_id),
  CONSTRAINT fk_participations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_participations_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  match_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favorite (user_id, match_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

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
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
);

INSERT INTO sports (name, slug) VALUES
('Basketball', 'basketball'),
('Football', 'football');
