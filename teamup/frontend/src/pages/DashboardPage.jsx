import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { demoMatches } from '../data/teamupDemo';
import { appAvatars, AvatarStack, IconStat, PagePanel, SportBadge, sportMeta } from '../components/InternalUI';
import UserAvatar from '../components/UserAvatar';
import { ArrowRight, Basketball, Bell, CalendarDays, CalendarPlus, Football, Hand, MessageCircle, Search, Star, Trophy, User } from '../components/landing/icons';

export default function DashboardPage() {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const isDemoAccount = user?.email === 'mehdi@teamup.local';
  const firstName = user?.first_name || user?.firstName || 'Sportif';
  const upcomingMatches = isDemoAccount ? demoMatches.slice(1, 4) : [];

  return (
    <div className="teamup-dashboard mx-auto grid w-full max-w-[1180px] items-start gap-5 xl:grid-cols-[minmax(0,1fr)_292px]">
      <section className="min-w-0">
        <Header firstName={firstName} />

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <IconStat Icon={CalendarDays} value={isDemoAccount ? '3' : '0'} label="À venir" helper="Prochains" color="#65A30D" />
          <IconStat Icon={Trophy} value={isDemoAccount ? '7' : '0'} label="Organisés" helper="Total" color="#F97316" />
          <IconStat Icon={Star} value={isDemoAccount ? '4.8/5' : '0/5'} label="Note" helper={isDemoAccount ? '24 avis' : '0 avis'} color="#F97316" />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <SportShortcut sport="Football" />
          <SportShortcut sport="Basketball" />
        </div>

        <PagePanel className="mt-5 overflow-hidden">
          <div className="teamup-upcoming-header flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-black text-slate-950">Mes prochains matchs</h2>
            <Link to="/my-matches" className="flex items-center gap-2 text-sm font-black text-lime-800">
              Voir tous <ArrowRight size={14} color="currentColor" />
            </Link>
          </div>
          <div className="teamup-upcoming-content px-5">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((match, index) => (
                <UpcomingMatch key={match.id} match={match} extra={index + 2} />
              ))
            ) : (
              <div className="py-5">
                <EmptyState title="Aucun match" description="Tu n’as pas encore rejoint de match." />
              </div>
            )}
          </div>
        </PagePanel>

        <PagePanel className="mt-5 overflow-hidden bg-lime-50/70">
          <div className="grid min-h-[126px] items-center gap-4 p-5 md:grid-cols-[56px_minmax(0,1fr)_260px]">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-lime-100 text-lime-700">
              <User size={22} color="currentColor" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-950">Organise ton match</h2>
              <p className="mt-1 text-xs text-slate-600">Crée une partie en quelques clics.</p>
              <Link to="/matches/create" className="mt-4 inline-flex items-center gap-3 rounded-lg bg-lime-700 px-5 py-2.5 text-xs font-black text-white">
                Créer un match <ArrowRight size={14} color="currentColor" />
              </Link>
            </div>
            <img src="/img/teamup-football-night-original.png" alt="" className="hidden h-32 w-full rounded-tl-[5rem] object-cover md:block" />
          </div>
        </PagePanel>
      </section>

      <aside className="teamup-dashboard-right grid min-w-0 content-start gap-5">
        <PagePanel className="p-5">
          <h2 className="text-xl font-black text-slate-950">Notifications</h2>
          <div className="mt-4 grid gap-4">
            {notifications.length > 0 ? (
              notifications.slice(0, 3).map((notification, index) => (
                <div key={notification._id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                  <UserAvatar user={{
                    name: ['Thomas', 'Sarah', 'Alex'][index] || 'Membre TeamUp',
                    avatar: appAvatars[index],
                  }} size="lg" />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-black leading-5 text-slate-950">{notification.message}</p>
                    <p className="mt-1 truncate text-sm font-bold text-lime-800">{notification.context}</p>
                  </div>
                  <p className="whitespace-nowrap text-xs text-slate-500">{notification.createdAt}</p>
                </div>
              ))
            ) : (
              <EmptyState title="Aucune notif" description="Tu n’as aucune notification." />
            )}
          </div>
          <Link to="/notifications" className="mt-6 flex items-center justify-center gap-2 text-sm font-black text-lime-800">
            Tout voir <ArrowRight size={14} color="currentColor" />
          </Link>
        </PagePanel>

        <PagePanel className="p-5">
          <h2 className="text-xl font-black text-slate-950">Accès rapides</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Quick href="/matches" Icon={Search} label="Rechercher" color="#65A30D" />
            <Quick href="/matches/create" Icon={CalendarPlus} label="Créer" color="#F97316" />
            <Quick href="/my-matches" Icon={CalendarDays} label="Matchs" color="#0EA5E9" />
            <Quick href="/notifications" Icon={Bell} label="Notifs" color="#9333EA" badge={unreadCount || undefined} />
            <Quick href="/messages" Icon={MessageCircle} label="Messages" color="#0284C7" badge="2" />
            <Quick href="/profile" Icon={User} label="Profil" color="#65A30D" />
          </div>
        </PagePanel>
      </aside>
    </div>
  );
}

function Header({ firstName }) {
  return (
    <div>
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-950">
          Bonjour {firstName} <Hand size={23} color="#F59E0B" />
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-5 text-slate-600">Trouve ou crée ton match.</p>
      </div>
    </div>
  );
}

function SportShortcut({ sport }) {
  const meta = sportMeta(sport);
  const Icon = sport === 'Basketball' ? Basketball : Football;
  const image = sport === 'Basketball' ? '/img/teamup-basketball-original.png' : '/img/teamup-football-original.png';

  return (
    <Link to="/matches" className={`teamup-sport-shortcut group relative min-h-[104px] overflow-hidden rounded-xl p-4 text-white ${meta.solid}`}>
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 transition group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent" />
      <div className="relative flex h-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Icon size={30} color="currentColor" />
          <div>
            <h2 className="text-lg font-black uppercase leading-5">{sport}</h2>
            <p className="mt-1 text-sm font-bold">Trouver</p>
          </div>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-lime-700">
          <ArrowRight size={15} color="currentColor" />
        </span>
      </div>
    </Link>
  );
}

function UpcomingMatch({ match, extra }) {
  const meta = sportMeta(match);
  return (
    <article className="teamup-upcoming-match grid items-center gap-4 border-b border-slate-100 py-3.5 last:border-b-0 md:grid-cols-[88px_minmax(0,1fr)_142px_84px]">
      <img src={match.image_url} alt={match.title} className="h-[74px] w-[88px] rounded-lg object-cover" />
      <div className="teamup-upcoming-info min-w-0">
        <SportBadge match={match} />
        <h3 className="mt-1 truncate text-[15px] font-black leading-5 text-slate-950">{match.title}</h3>
        <p className="mt-1 text-xs leading-4 text-slate-500">Dim. 11 mai · {String(match.match_time).slice(0, 5)}</p>
        <p className="truncate text-xs leading-4 text-slate-500">{match.city} · {match.location}</p>
      </div>
      <div className="teamup-upcoming-players min-w-0 justify-self-center">
        <AvatarStack count={4} extra={extra} />
        <p className="mt-2 text-center text-xs font-bold text-slate-700">{match.players_count}/{match.max_players} joueurs</p>
      </div>
      <Link to={`/matches/${match.id}`} className={`teamup-upcoming-action w-[76px] justify-self-end rounded-lg border px-3 py-2 text-center text-xs font-black ${meta.button}`}>
        Voir
      </Link>
    </article>
  );
}

function Quick({ href, Icon, label, color, badge }) {
  return (
    <Link to={href} className="teamup-quick-link relative grid min-h-[86px] place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white p-2 text-center transition hover:-translate-y-0.5 hover:shadow-md">
      {badge && <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-orange-600 text-xs font-black text-white">{badge}</span>}
      <Icon size={22} color={color} />
      <p className="mt-2 max-w-full truncate text-[11px] font-black leading-4 text-slate-950">{label}</p>
    </Link>
  );
}
