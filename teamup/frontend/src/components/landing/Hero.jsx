import { Basketball, Bell, CalendarDays, Football, MapPin, Search, ShieldCheck, Users } from './icons';
import Button from './Button';

const avatars = [
  '/img/avatar-mehdi-generated.png',
  '/img/avatar-sarah-generated.png',
  '/img/avatar-thomas-generated.png',
  '/img/avatar-alex-generated.png',
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#071417] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(101,163,13,0.25),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(249,115,22,0.18),transparent_28%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#071417] to-transparent" />

      <div className="relative mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl xl:text-8xl">
            Envie de jouer ?
            <br />
            Trouve des joueurs
            <br />
            <span className="text-[#F97316]">près de chez toi.</span>
            <br />
            Et lance ton prochain match.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
            Foot ou basket, trouve facilement des joueurs de ton niveau, rejoins un match près de chez toi ou crée le tien.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Button to="/login" withArrow>Trouver un match</Button>
            <Button to="/login" variant="secondary">Créer un match</Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <div className="flex -space-x-3">
              {avatars.map((avatar) => (
                <img key={avatar} src={avatar} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-[#071417]" />
              ))}
            </div>
            <div>
              <div className="text-sm font-black text-[#FF8A00]">★★★★★ <span className="ml-2 text-white">4.8/5</span></div>
              <p className="mt-1 text-sm text-white/60">Rejoins une communauté de joueurs passionnés</p>
            </div>
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-3xl animate-[fadeIn_.8s_ease-out]">
      <div className="rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="overflow-hidden rounded-[1.45rem] bg-[#0b171a] ring-1 ring-white/10">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-5 py-4">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-lime-400" />
            <span className="ml-4 rounded-full bg-white/10 px-4 py-1.5 text-xs text-white/50">teamup.app/dashboard</span>
          </div>

          <div className="grid min-h-[500px] grid-cols-[190px_1fr]">
            <aside className="border-r border-white/10 bg-black/20 p-4">
              <div className="mb-6 flex items-center gap-2">
                <img src="/img/logo-teamup.png" alt="" className="h-9 w-9 rounded-full bg-white/10" />
                <span className="text-sm font-black">TeamUp</span>
              </div>
              {[
                ['Recherche', Search],
                ['Mes matchs', CalendarDays],
                ['Participants', Users],
                ['Notifications', Bell],
                ['Sécurité', ShieldCheck],
              ].map(([label, Icon], index) => (
                <div key={label} className={`mb-2 flex items-center gap-3 rounded-2xl px-3 py-3 text-xs font-bold ${index === 0 ? 'bg-[#65A30D] text-white' : 'text-white/55'}`}>
                  <Icon size={15} />
                  {label}
                </div>
              ))}
            </aside>

            <main className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#65A30D]">Matchs proches</p>
                  <h3 className="mt-1 text-2xl font-black">Bonjour Mehdi</h3>
                </div>
                <div className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/60">Nanterre + 10 km</div>
              </div>

              <div className="mb-5 grid grid-cols-3 gap-3">
                {[
                  ['12', 'participations'],
                  ['4', 'organisés'],
                  ['4.8', 'note'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl bg-white/[0.06] p-4">
                    <p className="text-2xl font-black">{value}</p>
                    <p className="text-xs text-white/45">{label}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3">
                <PreviewMatch accent="bg-[#65A30D]" sport="Football" title="Foot 5 à Puteaux" players="8 / 10" />
                <PreviewMatch accent="bg-[#F97316]" sport="Basketball" title="Basket à Nanterre" players="7 / 10" />
                <PreviewMatch accent="bg-[#F97316]" sport="Basketball" title="Basket à Courbevoie" players="5 / 10" />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewMatch({ accent, sport, title, players }) {
  const SportIcon = sport === 'Football' ? Football : Basketball;

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/5">
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-2xl ${accent} text-white`}>
          <SportIcon size={18} color="currentColor" />
        </span>
        <div>
          <p className="font-bold">{title}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-white/45"><MapPin size={12} /> À proximité</p>
        </div>
      </div>
      <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/70">{players}</span>
    </div>
  );
}
