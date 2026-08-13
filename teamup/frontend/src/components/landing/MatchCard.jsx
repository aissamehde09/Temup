import { CalendarDays, MapPin, Users } from './icons';
import Button from './Button';

export default function MatchCard({ match }) {
  const isFootball = match.sport === 'Football';
  const accent = isFootball ? '#65A30D' : '#F97316';

  return (
    <article className="group overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-950/10">
      <div className="relative h-56 overflow-hidden">
        <img src={match.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071417]/70 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full px-3 py-1.5 text-xs font-black text-white" style={{ backgroundColor: accent }}>
          {match.sport}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-black text-[#071417]">{match.title}</h3>
        <div className="mt-4 grid gap-2 text-sm text-[#64748B]">
          <p className="flex items-center gap-2"><CalendarDays size={16} color={accent} /> {match.date}</p>
          <p className="flex items-center gap-2"><MapPin size={16} color={accent} /> {match.city}</p>
          <p className="font-semibold text-[#071417]">{match.level}</p>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div>
            <div className="mb-2 flex -space-x-2">
              {match.avatars.map((avatar) => (
                <img key={avatar} src={avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-white" />
              ))}
            </div>
            <p className="flex items-center gap-1 text-sm font-bold text-[#071417]"><Users size={15} /> {match.players}</p>
          </div>
          <Button to={`/matches/${match.id}`} variant="outline" className="px-4 py-2.5">Voir le match</Button>
        </div>
      </div>
    </article>
  );
}
