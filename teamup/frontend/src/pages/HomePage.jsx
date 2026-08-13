import { Link } from 'react-router-dom';
import Button from '../components/Button';
import MatchCard from '../components/MatchCard';

const nearMatches = [
  { id: 1, sport_name: 'Basketball', title: 'Basket à Nanterre', city: 'Nanterre', location: 'Terrain extérieur', match_date: new Date().toISOString(), match_time: '16:00', level: 'Intermédiaire', players_count: 7, max_players: 10, image_url: '/img/teamup-basketball-original.png' },
  { id: 2, sport_name: 'Football', title: 'Football à Puteaux', city: 'Puteaux', location: 'Stade de Puteaux', match_date: new Date().toISOString(), match_time: '11:00', level: 'Débutant', players_count: 8, max_players: 12, image_url: '/img/teamup-football-original.png' },
];

export default function HomePage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-24">
        <div>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 md:text-7xl">
            Trouve des joueurs. Crée ton match. <span className="text-emerald-600">Joue ensemble.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
            TeamUp t'aide à rencontrer des sportifs près de chez toi et à organiser des matchs facilement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/matches"><Button>Trouver un match</Button></Link>
            <Link to="/matches/create"><Button variant="secondary">Créer un match</Button></Link>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {[['10 000+', 'joueurs'], ['1 250+', 'matchs organisés'], ['150+', 'villes']].map(([value, label]) => (
              <div key={label} className="rounded-3xl bg-white p-5 shadow-sm">
                <strong className="block text-2xl text-slate-950">{value}</strong>
                <span className="text-sm text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-xl">
          <img src="/img/teamup-basketball-original.png" alt="Match de basket" className="h-[520px] w-full rounded-[1.5rem] object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black">Matchs proches</h2>
            <p className="mt-2 text-slate-500">Des parties disponibles autour de toi.</p>
          </div>
          <Link to="/matches" className="font-semibold text-emerald-700">Voir tous</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {nearMatches.map((match) => <MatchCard key={match.id} match={match} />)}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black">Comment ça marche ?</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {['Trouve un match', 'Rejoins la partie', 'Joue', 'Reviens et organise ton prochain match'].map((step, index) => (
              <div key={step} className="rounded-3xl bg-slate-50 p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 font-bold text-white">{index + 1}</span>
                <h3 className="mt-5 font-bold">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

