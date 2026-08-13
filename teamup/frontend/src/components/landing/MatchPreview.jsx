import SectionTitle from './SectionTitle';
import MatchCard from './MatchCard';

const avatars = [
  '/img/avatar-mehdi-generated.png',
  '/img/avatar-sarah-generated.png',
  '/img/avatar-thomas-generated.png',
  '/img/avatar-alex-generated.png',
];

const matches = [
  {
    id: 1,
    sport: 'Basketball',
    title: 'Basket à Nanterre',
    date: 'Samedi 16h00',
    city: 'Nanterre',
    level: 'Niveau intermédiaire',
    players: '7 / 10 joueurs',
    image: '/img/teamup-basketball-original.png',
    avatars,
  },
  {
    id: 2,
    sport: 'Football',
    title: 'Foot 5 à Puteaux',
    date: 'Dimanche 11h00',
    city: 'Puteaux',
    level: 'Niveau débutant',
    players: '8 / 10 joueurs',
    image: '/img/teamup-football-original.png',
    avatars,
  },
  {
    id: 3,
    sport: 'Basketball',
    title: 'Basket à Courbevoie',
    date: 'Mercredi 19h00',
    city: 'Courbevoie',
    level: 'Niveau confirmé',
    players: '5 / 10 joueurs',
    image: '/img/teamup-basketball-gym-original.png',
    avatars,
  },
];

export default function MatchPreview() {
  return (
    <section id="matches" className="bg-white px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle title="Un match t'attend près de chez toi" subtitle="Découvre les prochaines parties organisées par la communauté." />
        <div className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((match) => <MatchCard key={match.id} match={match} />)}
        </div>
      </div>
    </section>
  );
}
