import { Link } from 'react-router-dom';

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(value));
}

export default function MatchCard({ match }) {
  const placesLeft = Number(match.max_players) - Number(match.players_count || 0);

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md">
      <img
        src={match.image_url || '/img/teamup-basketball-original.png'}
        alt={`Illustration du match ${match.title}`}
        className="h-48 w-full object-cover"
      />
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{match.sport_name}</span>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">{match.level}</span>
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-950">{match.title}</h3>
        <p className="mt-2 text-sm text-slate-500">{match.city} · {match.location}</p>
        <p className="mt-3 text-sm font-semibold text-slate-700">{formatDate(match.match_date)} · {String(match.match_time).slice(0, 5)}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-slate-600">
            <strong className="text-slate-950">{match.players_count || 0} / {match.max_players}</strong> joueurs · {placesLeft} places
          </span>
          <Link to={`/matches/${match.id}`} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Voir
          </Link>
        </div>
      </div>
    </article>
  );
}
