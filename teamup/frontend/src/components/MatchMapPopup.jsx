import { Link } from 'react-router-dom';

export default function MatchMapPopup({ match, color }) {
  return (
    <div className="min-w-[190px] py-1">
      <p className="text-[10px] font-black uppercase tracking-wide" style={{ color }}>
        {match.sport_name}
      </p>
      <h3 className="mt-1 text-sm font-black text-slate-950">{match.title}</h3>
      <p className="mt-1 text-xs text-slate-600">
        {new Date(`${match.match_date}T${match.match_time}`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} · {String(match.match_time).slice(0, 5)}
      </p>
      <p className="mt-1 text-xs font-semibold text-slate-700">📍 {match.location || match.city}</p>
      {match.address && match.address !== match.location && <p className="mt-1 text-[11px] text-slate-500">{match.address}</p>}
      <p className="mt-1 text-xs font-semibold text-slate-700">{match.players_count} / {match.max_players} joueurs</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link to={`/matches/${match.id}`} className="inline-flex rounded-md bg-lime-800 px-3 py-2 text-xs font-black text-white hover:bg-lime-700">Voir le match</Link>
        {/^https?:\/\//i.test(match.location || '') && <a href={match.location} target="_blank" rel="noreferrer" className="inline-flex rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Ouvrir le lieu</a>}
      </div>
    </div>
  );
}
