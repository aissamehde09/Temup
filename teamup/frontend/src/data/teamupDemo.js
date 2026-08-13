export const demoUser = {
  id: 1,
  first_name: 'Mehdi',
  last_name: 'Ait',
  email: 'mehdi@teamup.local',
  city: 'Nanterre',
  level: 'Intermédiaire',
  avatar_url: null,
  sports: ['Football', 'Basketball'],
};

export const demoMatches = [
  {
    id: 1,
    sport_id: 1,
    sport_name: 'Basketball',
    title: 'Basket à Nanterre',
    city: 'Nanterre',
    location: 'Terrain extérieur Nanterre',
    address: 'Rue des Vignes, 92000 Nanterre',
    match_date: '2026-08-16',
    match_time: '16:00:00',
    level: 'Intermédiaire',
    max_players: 10,
    players_count: 7,
    organizer_first_name: 'Julien',
    organizer_last_name: 'D.',
    description: 'Match convivial sur terrain extérieur. Bonne ambiance, fair-play et respect du niveau.',
    image_url: '/img/teamup-basketball-original.png',
    latitude: 48.8924,
    longitude: 2.2067,
  },
  {
    id: 2,
    sport_id: 2,
    sport_name: 'Football',
    title: 'Foot 5 à Puteaux',
    city: 'Puteaux',
    location: 'Stade de Puteaux',
    address: 'Île de Puteaux, 92800 Puteaux',
    match_date: '2026-08-17',
    match_time: '11:00:00',
    level: 'Débutant',
    max_players: 10,
    players_count: 8,
    organizer_first_name: 'Alex',
    organizer_last_name: 'Martin',
    description: 'Foot 5 ouvert aux débutants. Pense à prendre une bouteille d’eau.',
    image_url: '/img/teamup-football-original.png',
    latitude: 48.8847,
    longitude: 2.2382,
  },
  {
    id: 3,
    sport_id: 1,
    sport_name: 'Basketball',
    title: 'Basket à Courbevoie',
    city: 'Courbevoie',
    location: 'Gymnase Jean-Pierre Rives',
    address: '91 Boulevard de Verdun, 92400 Courbevoie',
    match_date: '2026-08-19',
    match_time: '19:00:00',
    level: 'Confirmé',
    max_players: 10,
    players_count: 5,
    organizer_first_name: 'Sarah',
    organizer_last_name: 'Benali',
    description: 'Session intense pour joueurs réguliers.',
    image_url: '/img/teamup-basketball-gym-original.png',
    latitude: 48.8967,
    longitude: 2.2567,
  },
  {
    id: 4,
    sport_id: 2,
    sport_name: 'Football',
    title: 'Football à Levallois',
    city: 'Levallois',
    location: 'Parc des Sports',
    address: '33 Rue Baudin, 92300 Levallois',
    match_date: '2026-08-21',
    match_time: '20:00:00',
    level: 'Intermédiaire',
    max_players: 14,
    players_count: 9,
    organizer_first_name: 'Thomas',
    organizer_last_name: 'Dubois',
    description: 'Match équilibré, esprit fair-play demandé.',
    image_url: '/img/teamup-football-night-original.png',
    latitude: 48.8932,
    longitude: 2.2879,
  },
];

export const demoNotifications = [
  { _id: 'n1', type: 'MATCH_JOINED', message: 'Thomas a rejoint', context: 'Basket à Nanterre', read: false, createdAt: '10 min' },
  { _id: 'n2', type: 'MATCH_FULL', message: 'Match presque complet', context: '8/10 joueurs', read: false, createdAt: '2 h' },
  { _id: 'n3', type: 'MATCH_UPDATED', message: 'Match modifié', context: 'Foot 5 à Puteaux', read: true, createdAt: 'Hier' },
];

export const demoConversations = [
  { id: 1, title: 'Basket à Nanterre', sender: 'Thomas', preview: 'Parfait, à samedi !', unread: true },
  { id: 2, title: 'Sarah', sender: 'Sarah', preview: "Merci pour l'invitation", unread: false },
  { id: 3, title: 'Foot Puteaux', sender: 'Alex', preview: 'Tu viens demain ?', unread: false },
];

export function sportTheme(matchOrSport) {
  const name = typeof matchOrSport === 'string' ? matchOrSport : matchOrSport?.sport_name;
  return String(name).toLowerCase().includes('basket')
    ? { name: 'Basketball', accent: 'orange', bg: 'bg-orange-500', text: 'text-orange-600', soft: 'bg-orange-50' }
    : { name: 'Football', accent: 'green', bg: 'bg-lime-500', text: 'text-lime-700', soft: 'bg-lime-50' };
}
