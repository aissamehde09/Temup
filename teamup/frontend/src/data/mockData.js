export const users = [
  {
    id: 1,
    firstName: 'Mehdi',
    lastName: 'Ait',
    pseudo: 'demo_mehdi',
    city: 'Nanterre',
    level: 'Intermédiaire',
    sports: ['Football', 'Basketball'],
    avatar: '/img/avatar-mehdi-generated.png',
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Benali',
    pseudo: 'sarah_basket',
    city: 'Courbevoie',
    level: 'Confirmé',
    sports: ['Basketball'],
    avatar: '/img/avatar-sarah-generated.png',
  },
  {
    id: 3,
    firstName: 'Thomas',
    lastName: 'Dubois',
    pseudo: 'tom_foot',
    city: 'Levallois',
    level: 'Intermédiaire',
    sports: ['Football'],
    avatar: '/img/avatar-thomas-generated.png',
  },
  {
    id: 4,
    firstName: 'Alex',
    lastName: 'Martin',
    pseudo: 'alex92',
    city: 'Puteaux',
    level: 'Débutant',
    sports: ['Football', 'Basketball'],
    avatar: '/img/avatar-alex-generated.png',
  },
];

export const matches = [
  {
    id: 1,
    title: 'Basket à Nanterre',
    sport: 'Basketball',
    city: 'Nanterre',
    location: 'Terrain extérieur Nanterre',
    date: 'Samedi',
    time: '16h00',
    level: 'Intermédiaire',
    maxPlayers: 10,
    participants: [users[0], users[1], users[2], users[3], users[1], users[2], users[3]],
    image: '/img/teamup-basketball-original.png',
    organizer: users[0],
    description: 'Match convivial sur terrain extérieur. Bonne ambiance, fair-play et respect du niveau demandé.',
  },
  {
    id: 2,
    title: 'Foot 5 à Puteaux',
    sport: 'Football',
    city: 'Puteaux',
    location: 'Stade de Puteaux',
    date: 'Dimanche',
    time: '11h00',
    level: 'Débutant',
    maxPlayers: 10,
    participants: [users[0], users[2], users[3], users[1], users[2], users[3], users[0], users[1]],
    image: '/img/teamup-football-original.png',
    organizer: users[3],
    description: 'Foot 5 ouvert aux débutants. Partie simple, bonne humeur obligatoire et esprit collectif.',
  },
  {
    id: 3,
    title: 'Basket à Courbevoie',
    sport: 'Basketball',
    city: 'Courbevoie',
    location: 'Gymnase Jean-Pierre Rives',
    date: 'Mercredi',
    time: '19h00',
    level: 'Confirmé',
    maxPlayers: 10,
    participants: [users[0], users[1], users[2], users[3], users[1]],
    image: '/img/teamup-basketball-gym-original.png',
    organizer: users[1],
    description: 'Session intense pour joueurs réguliers. Prévoir chaussures propres et arrivée 10 minutes avant.',
  },
  {
    id: 4,
    title: 'Football à Levallois',
    sport: 'Football',
    city: 'Levallois',
    location: 'Parc des Sports',
    date: 'Jeudi',
    time: '20h00',
    level: 'Intermédiaire',
    maxPlayers: 14,
    participants: [users[0], users[2], users[3], users[1], users[2], users[3], users[0], users[1], users[2]],
    image: '/img/teamup-football-night-original.png',
    organizer: users[2],
    description: 'Match équilibré sur grand terrain. Respect, rotation et fair-play demandés.',
  },
];

export const notifications = [
  { id: 1, title: 'Thomas a rejoint ton match', text: 'Basket à Nanterre', time: 'Il y a 10 min', read: false },
  { id: 2, title: 'Ton match commence dans 2 heures', text: 'Foot 5 à Puteaux', time: 'Il y a 1 h', read: false },
  { id: 3, title: 'Un match a été modifié', text: 'Basket à Courbevoie', time: 'Hier', read: true },
  { id: 4, title: 'Ton match est complet', text: 'Football à Levallois', time: 'Hier', read: true },
];

export const currentUser = users[0];

export function getSportTheme(sport) {
  return sport === 'Basketball'
    ? { color: 'orange', icon: 'Basketball', accent: '#F97316' }
    : { color: 'green', icon: 'CircleDot', accent: '#65A30D' };
}
