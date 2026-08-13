USE teamup;

INSERT INTO sports (name, slug) VALUES
('Basketball', 'basketball'),
('Football', 'football')
ON DUPLICATE KEY UPDATE
name = VALUES(name);

INSERT INTO users (first_name, last_name, email, password_hash, city, level, role, avatar_url) VALUES
('Mehdi', 'Ait', 'mehdi@teamup.local', '$2b$10$yxT8DPM2XJ2XIrBwD06zyely6PWRVGPygWJadVZo9.OIo/66wG5Ga', 'Nanterre', 'Intermédiaire', 'ADMIN', '/img/avatar-mehdi.jpg'),
('Alex', 'Martin', 'alex@teamup.local', '$2b$10$yxT8DPM2XJ2XIrBwD06zyely6PWRVGPygWJadVZo9.OIo/66wG5Ga', 'Puteaux', 'Débutant', 'USER', '/img/avatar-alex.jpg'),
('Sarah', 'Benali', 'sarah@teamup.local', '$2b$10$yxT8DPM2XJ2XIrBwD06zyely6PWRVGPygWJadVZo9.OIo/66wG5Ga', 'Courbevoie', 'Confirmé', 'USER', '/img/avatar-sarah.jpg'),
('Thomas', 'Dubois', 'thomas@teamup.local', '$2b$10$yxT8DPM2XJ2XIrBwD06zyely6PWRVGPygWJadVZo9.OIo/66wG5Ga', 'Levallois', 'Intermédiaire', 'USER', '/img/avatar-thomas.jpg')
ON DUPLICATE KEY UPDATE
first_name = VALUES(first_name),
last_name = VALUES(last_name),
password_hash = VALUES(password_hash),
city = VALUES(city),
level = VALUES(level),
role = VALUES(role),
avatar_url = VALUES(avatar_url);


INSERT IGNORE INTO user_sports (user_id, sport_id)
SELECT u.id, s.id
FROM users u
JOIN sports s ON s.slug IN ('basketball', 'football')
WHERE u.email = 'mehdi@teamup.local';

INSERT IGNORE INTO user_sports (user_id, sport_id)
SELECT u.id, s.id
FROM users u
JOIN sports s ON s.slug = 'football'
WHERE u.email = 'alex@teamup.local';

INSERT IGNORE INTO user_sports (user_id, sport_id)
SELECT u.id, s.id
FROM users u
JOIN sports s ON s.slug = 'basketball'
WHERE u.email = 'sarah@teamup.local';

INSERT IGNORE INTO user_sports (user_id, sport_id)
SELECT u.id, s.id
FROM users u
JOIN sports s ON s.slug IN ('basketball', 'football')
WHERE u.email = 'thomas@teamup.local';

INSERT INTO matches (sport_id, organizer_id, title, city, location, address, match_date, match_time, level, max_players, description, image_url)
SELECT s.id, u.id, 'Basket à Nanterre', 'Nanterre', 'Terrain extérieur Nanterre', 'Rue des Vignes, 92000 Nanterre', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '16:00:00', 'Intermédiaire', 10, 'Match convivial sur terrain extérieur. Bonne ambiance et respect du niveau.', '/img/basket-nanterre.jpg'
FROM sports s
JOIN users u ON u.email = 'mehdi@teamup.local'
WHERE s.slug = 'basketball'
AND NOT EXISTS (
  SELECT 1 FROM matches m WHERE m.title = 'Basket à Nanterre' AND m.city = 'Nanterre'
);

INSERT INTO matches (sport_id, organizer_id, title, city, location, address, match_date, match_time, level, max_players, description, image_url)
SELECT s.id, u.id, 'Foot 5 à Puteaux', 'Puteaux', 'Stade de Puteaux', 'Île de Puteaux, 92800 Puteaux', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '11:00:00', 'Débutant', 12, 'Foot 5 ouvert aux débutants. Pense à prendre une bouteille d’eau.', '/img/football-puteaux.jpg'
FROM sports s
JOIN users u ON u.email = 'alex@teamup.local'
WHERE s.slug = 'football'
AND NOT EXISTS (
  SELECT 1 FROM matches m WHERE m.title = 'Foot 5 à Puteaux' AND m.city = 'Puteaux'
);

INSERT INTO matches (sport_id, organizer_id, title, city, location, address, match_date, match_time, level, max_players, description, image_url)
SELECT s.id, u.id, 'Basket à Courbevoie', 'Courbevoie', 'Gymnase Jean-Pierre Rives', '91 Boulevard de Verdun, 92400 Courbevoie', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '19:00:00', 'Confirmé', 10, 'Session intense pour joueurs réguliers.', '/img/basket-courbevoie.jpg'
FROM sports s
JOIN users u ON u.email = 'sarah@teamup.local'
WHERE s.slug = 'basketball'
AND NOT EXISTS (
  SELECT 1 FROM matches m WHERE m.title = 'Basket à Courbevoie' AND m.city = 'Courbevoie'
);

INSERT INTO matches (sport_id, organizer_id, title, city, location, address, match_date, match_time, level, max_players, description, image_url)
SELECT s.id, u.id, 'Football à Levallois', 'Levallois', 'Parc des Sports', '33 Rue Baudin, 92300 Levallois', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '20:00:00', 'Intermédiaire', 14, 'Match équilibré, esprit fair-play demandé.', '/img/football-levallois.jpg'
FROM sports s
JOIN users u ON u.email = 'thomas@teamup.local'
WHERE s.slug = 'football'
AND NOT EXISTS (
  SELECT 1 FROM matches m WHERE m.title = 'Football à Levallois' AND m.city = 'Levallois'
);

INSERT IGNORE INTO participations (user_id, match_id)
SELECT u.id, m.id
FROM users u
JOIN matches m ON m.title = 'Basket à Nanterre' AND m.city = 'Nanterre'
WHERE u.email IN ('alex@teamup.local', 'sarah@teamup.local', 'thomas@teamup.local');

INSERT IGNORE INTO participations (user_id, match_id)
SELECT u.id, m.id
FROM users u
JOIN matches m ON m.title = 'Foot 5 à Puteaux' AND m.city = 'Puteaux'
WHERE u.email IN ('mehdi@teamup.local', 'sarah@teamup.local', 'thomas@teamup.local');

INSERT IGNORE INTO participations (user_id, match_id)
SELECT u.id, m.id
FROM users u
JOIN matches m ON m.title = 'Basket à Courbevoie' AND m.city = 'Courbevoie'
WHERE u.email IN ('mehdi@teamup.local', 'alex@teamup.local');
