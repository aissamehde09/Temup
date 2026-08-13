import { Link } from 'react-router-dom';
import { Basketball, CalendarDays, Clock, Football, MapPin, ShieldCheck } from './landing/icons';

export const appAvatars = [
  '/img/avatar-mehdi-generated.png',
  '/img/avatar-sarah-generated.png',
  '/img/avatar-thomas-generated.png',
  '/img/avatar-alex-generated.png',
];

export function PagePanel({ children, className = '' }) {
  return (
    <section className={`teamup-panel rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export function PageTitle({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-950">{title}</h1>
        {subtitle && <p className="mt-1 text-xs font-medium text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function sportMeta(matchOrSport) {
  const name = typeof matchOrSport === 'string' ? matchOrSport : matchOrSport?.sport_name;
  const isBasket = String(name).toLowerCase().includes('basket');
  return {
    label: isBasket ? 'BASKETBALL' : 'FOOTBALL',
    name: isBasket ? 'Basketball' : 'Football',
    color: isBasket ? '#F97316' : '#65A30D',
    soft: isBasket ? 'bg-orange-50 text-orange-600' : 'bg-lime-50 text-lime-700',
    border: isBasket ? 'border-orange-500 text-orange-600' : 'border-lime-700 text-lime-700',
    button: isBasket ? 'border-orange-500 text-orange-600 hover:bg-orange-50' : 'border-lime-700 text-lime-700 hover:bg-lime-50',
    solid: isBasket ? 'bg-orange-500' : 'bg-lime-700',
  };
}

export function SportBadge({ match, className = '' }) {
  const meta = sportMeta(match);
  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-[11px] font-black uppercase ${meta.soft} ${className}`}>
      {meta.label}
    </span>
  );
}

export function AvatarStack({ count = 4, extra, size = 'h-8 w-8' }) {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {appAvatars.slice(0, count).map((avatar, index) => (
          avatar ? <img key={index} src={avatar} alt="" className={`${size} rounded-full object-cover ring-2 ring-white`} /> : (
            <span key={index} className={`${size} grid place-items-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-700 ring-2 ring-white`} aria-label="Membre TeamUp">
              {['TU', 'SA', 'TH', 'AL'][index] || 'TU'}
            </span>
          )
        ))}
      </div>
      {extra && (
        <span className="ml-2 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
          +{extra}
        </span>
      )}
    </div>
  );
}

export function MatchInfo({ match, compact = false }) {
  return (
    <div className={`grid gap-1 ${compact ? 'text-xs' : 'text-sm'} text-slate-500`}>
      <p className="flex items-center gap-2">
        <CalendarDays size={13} color="currentColor" />
        {match.dateLabel || formatDateLabel(match.match_date)}
        <Clock size={13} color="currentColor" className="ml-2" />
        {String(match.match_time).slice(0, 5)}
      </p>
      <p className="flex items-center gap-2">
        <MapPin size={13} color="currentColor" />
        {match.city} - {match.location}
      </p>
    </div>
  );
}

function formatDateLabel(value) {
  if (!value) return 'Date non renseignée';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function MatchListRow({ match, actions, playersText, imageSize = 'h-24 w-24' }) {
  const meta = sportMeta(match);
  return (
    <article className="teamup-my-match-row grid items-center gap-4 border-b border-slate-100 py-4 last:border-b-0 md:grid-cols-[auto_1fr_auto_auto]">
      <img src={match.image_url} alt={match.title} className={`${imageSize} rounded-lg object-cover`} />
      <div className="teamup-my-match-info min-w-0">
        <SportBadge match={match} />
        <h2 className="mt-1 text-lg font-black text-slate-950">{match.title}</h2>
        <MatchInfo match={match} compact />
      </div>
      <div className="teamup-my-match-players flex items-center gap-4">
        <AvatarStack count={4} extra={match.players_count > 8 ? 2 : undefined} />
        <p className="w-20 text-sm font-bold text-slate-700">{playersText || `${match.players_count}/${match.max_players}`}</p>
      </div>
      <div className="teamup-my-match-actions flex justify-end gap-3">{actions || (
        <Link to={`/matches/${match.id}`} className={`rounded-lg border px-5 py-2 text-sm font-bold ${meta.button}`}>
          Voir
        </Link>
      )}</div>
    </article>
  );
}

export function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      {children}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-lime-600 ${props.className || ''}`}
    />
  );
}

export function SelectInput({ children, className = '', ...props }) {
  return (
    <select
      {...props}
      className={`h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-lime-600 ${className}`}
    >
      {children}
    </select>
  );
}

export function IconStat({ Icon, value, label, helper, color = '#65A30D' }) {
  return (
    <PagePanel className="flex min-h-[96px] items-center gap-4 p-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ backgroundColor: `${color}12`, color }}>
        <Icon size={21} color="currentColor" />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-black leading-none" style={{ color }}>{value}</p>
        <p className="mt-1 text-sm font-black leading-5 text-slate-950">{label}</p>
        {helper && <p className="mt-0.5 text-xs leading-4 text-slate-500">{helper}</p>}
      </div>
    </PagePanel>
  );
}

export function SportIconBubble({ sport, className = '' }) {
  const meta = sportMeta(sport);
  return (
    <span className={`grid h-12 w-12 place-items-center rounded-full ${className}`} style={{ backgroundColor: `${meta.color}14`, color: meta.color }}>
      {meta.name === 'Basketball' ? <Basketball size={24} color="currentColor" /> : <Football size={24} color="currentColor" />}
    </span>
  );
}

export function RemainingPlaces({ match }) {
  const remaining = Math.max(0, Number(match.max_players) - Number(match.players_count));
  return (
    <div className="rounded-lg bg-lime-50 px-6 py-4 text-center text-sm font-bold text-lime-800">
      {remaining === 0 ? '0 place restante' : `${remaining} places restantes`}
    </div>
  );
}

export function MetaItem({ Icon = ShieldCheck, title, value }) {
  return (
    <div className="flex gap-4">
      <Icon size={16} color="#334155" className="mt-1" />
      <div>
        <p className="text-sm font-black text-slate-900">{title}</p>
        <p className="mt-1 text-xs font-medium text-slate-500">{value}</p>
      </div>
    </div>
  );
}
