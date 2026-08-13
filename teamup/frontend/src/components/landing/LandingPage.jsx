import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import {
  CalendarDays,
  CalendarPlus,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Trophy,
  Users,
} from './icons';

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
    level: 'Intermédiaire',
    players: '7 / 10 joueurs',
    image: '/img/teamup-basketball-original.png',
  },
  {
    id: 2,
    sport: 'Football',
    title: 'Foot 5 à Puteaux',
    date: 'Dimanche 11h00',
    city: 'Puteaux',
    level: 'Débutant',
    players: '8 / 10 joueurs',
    image: '/img/teamup-football-original.png',
  },
  {
    id: 3,
    sport: 'Basketball',
    title: 'Basket à Courbevoie',
    date: 'Mercredi 19h00',
    city: 'Courbevoie',
    level: 'Confirmé',
    players: '5 / 10 joueurs',
    image: '/img/teamup-basketball-gym-original.png',
  },
];

const features = [
  [Users, 'Trouve facilement', 'Recherche des matchs près de chez toi avec des filtres simples.'],
  [CalendarPlus, 'Organise tes matchs', 'Crée ton match en quelques clics et invite des joueurs.'],
  [MessageCircle, 'Reste connecté', 'Retrouve les infos, joueurs et notifications au même endroit.'],
  [ShieldCheck, 'Communauté fiable', 'Rejoins une communauté sportive respectueuse et passionnée.'],
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#071417] font-['Poppins',ui-sans-serif,system-ui] text-[#071417]">
      <div className="min-h-screen w-full bg-white">
        <Navbar />
        <Hero />
        <MatchSection />
        <FeatureSection />
        <HowSection />
        <BottomCTA />
        <Footer />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="teamup-landing-hero relative overflow-hidden bg-[#071417] px-6 pb-9 pt-7 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(101,163,13,.25),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(249,115,22,.15),transparent_30%)]" />
      <div className="teamup-landing-hero-grid relative grid items-center gap-8 lg:grid-cols-[.85fr_1.15fr]">
        <div className="teamup-landing-copy">
          <h1 className="teamup-landing-title max-w-xl text-3xl font-black leading-[1.05] tracking-tight md:text-4xl">
            Envie de jouer ?
            <br />
            Trouve des joueurs
            <br />
            près de chez toi.
            <br />
            <span className="text-[#F97316]">Et lance ton prochain match.</span>
          </h1>
          <p className="teamup-landing-subtitle mt-5 max-w-lg text-sm leading-6 text-white/70">
            Foot ou basket, trouve facilement des joueurs de ton niveau, rejoins un match près de chez toi ou crée le tien.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-[#65A30D] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#4d7c0f]">
              Trouver un match <span>→</span>
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15">
              Créer un match <span>＋</span>
            </Link>
          </div>
          <StatsRow />
        </div>
        <DashboardMockup />
      </div>
    </section>
  );
}

function StatsRow() {
  const items = [
    [Users, '10K+', 'Joueurs actifs', '#65A30D'],
    [Trophy, '5K+', 'Matchs organisés', '#F97316'],
    [MapPin, '150+', 'Villes couvertes', '#65A30D'],
    [Star, '4.8/5', 'Note moyenne', '#F97316'],
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 md:grid-cols-4">
      {items.map(([Icon, value, label, color]) => (
        <div key={label} className="flex items-center gap-2">
          <Icon size={22} color={color} />
          <div>
            <p className="text-lg font-black">{value}</p>
            <p className="text-[10px] font-semibold text-white/50">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-2 shadow-2xl shadow-black/40">
      <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
        <img
          src="/img/dashboard-preview.png"
          alt="Aperçu du dashboard TeamUp"
          className="block h-auto w-full object-contain object-top"
        />
      </div>
    </div>
  );
}

function MatchSection() {
  return (
    <section id="matches" className="bg-white px-6 py-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">Des matchs près de chez toi</h2>
        <Link to="/login" className="text-xs font-bold text-[#071417]">Voir tous les matchs →</Link>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {matches.map((match) => <MatchCard key={match.id} match={match} />)}
      </div>
    </section>
  );
}

function MatchCard({ match }) {
  const isBasket = match.sport === 'Basketball';
  const color = isBasket ? '#F97316' : '#65A30D';

  return (
    <article className="group relative min-h-52 overflow-hidden rounded-xl bg-[#071417] p-4 text-white shadow-lg transition hover:-translate-y-1">
      <img src={match.image} alt={match.title} className="absolute inset-0 h-full w-full object-cover opacity-55 transition group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="relative flex h-full min-h-44 flex-col justify-end">
        <span className="mb-3 w-fit rounded px-2 py-1 text-[10px] font-black uppercase text-white" style={{ backgroundColor: color }}>
          {match.sport}
        </span>
        <h3 className="text-lg font-black">{match.title}</h3>
        <div className="mt-2 grid gap-1 text-xs text-white/80">
          <p className="flex items-center gap-2"><CalendarDays size={13} color="currentColor" /> {match.date}</p>
          <p className="flex items-center gap-2"><MapPin size={13} color="currentColor" /> {match.city}</p>
          <p className="flex items-center gap-2"><ShieldCheck size={13} color="currentColor" /> {match.level}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {avatars.slice(0, 3).map((avatar) => (
                <img key={avatar} src={avatar} alt="" className="h-6 w-6 rounded-full object-cover ring-1 ring-white" />
              ))}
            </div>
            <span className="text-xs font-black">{match.players}</span>
          </div>
          <Link to="/login" className="rounded bg-[#F97316] px-3 py-2 text-[11px] font-black text-white">
            Voir le match
          </Link>
        </div>
      </div>
    </article>
  );
}

function FeatureSection() {
  return (
    <section id="about" className="bg-white px-6 pb-6">
      <h2 className="text-center text-xl font-black">Pourquoi choisir TeamUp ?</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {features.map(([Icon, title, text], index) => (
          <article key={title} className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <Icon className="mx-auto" size={28} color={index % 2 ? '#F97316' : '#65A30D'} />
            <h3 className="mt-3 text-sm font-black">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HowSection() {
  const steps = [
    ['1', 'Crée ton compte', 'Inscris-toi gratuitement et complète ton profil.'],
    ['2', 'Trouve ou crée un match', 'Choisis un match disponible ou organise le tien.'],
    ['3', 'Rejoins et joue', 'Retrouve les joueurs et profite du match.'],
  ];

  return (
    <section id="how" className="bg-white px-6 pb-7">
      <h2 className="text-center text-lg font-black">Comment ça marche ?</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {steps.map(([number, title, text]) => (
          <div key={number} className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#65A30D] text-sm font-black text-white">{number}</span>
            <div>
              <h3 className="text-sm font-black">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="bg-white px-6 py-8">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#071417] text-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[1fr_.82fr]">
        <div className="flex min-h-[300px] flex-col justify-center p-8 sm:p-10 lg:p-12">
          <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-tight md:text-4xl">
            Prêt à jouer ? Rejoins la communauté TeamUp !
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
            Des milliers de joueurs t’attendent déjà pour organiser ton prochain match.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link to="/login" className="rounded-full bg-[#65A30D] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#4d7c0f]">
              Trouver un match
            </Link>
            <Link to="/login" className="rounded-full border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10">
              Créer un match
            </Link>
          </div>
        </div>
        <div className="relative min-h-[260px] overflow-hidden lg:min-h-[300px]">
          <img
            src="/img/teamup-football-original.png"
            alt="Joueurs de football"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071417] via-[#071417]/20 to-transparent lg:from-[#071417]/35" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="teamup-footer bg-[#071417] px-6 py-9 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="teamup-footer-block">
          <div className="teamup-footer-brand flex w-fit items-center gap-2">
            <img src="/img/logo-teamup.png" alt="TeamUp" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-lg font-black text-[#F97316]">TeamUp</span>
          </div>
          <p className="mt-3 max-w-sm text-xs leading-5 text-white/55">
            La plateforme pour rencontrer des sportifs et organiser des matchs près de chez toi.
          </p>
        </div>
        <FooterLinks title="Navigation" links={['Accueil', 'Trouver un match', 'Comment ça marche', 'À propos']} />
        <FooterLinks title="Aide" links={['FAQ', 'Contact', 'Conditions d’utilisation']} />
        <FooterLinks title="Légal" links={['Mentions légales', 'CGU', 'Politique de cookies']} />
      </div>
      <p className="teamup-footer-copy mt-7 text-center text-[11px] text-white/35">© 2026 TeamUp. Tous droits réservés.</p>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  const hrefs = {
    Accueil: '/',
    'Trouver un match': '/matches',
    'Comment ça marche': '/#how',
    'À propos': '/#about',
    FAQ: '/faq', Contact: '/contact', 'Conditions d’utilisation': '/terms',
    'Mentions légales': '/legal', CGU: '/cgu', 'Politique de cookies': '/cookies',
  };
  return (
    <div className="teamup-footer-block">
      <h3 className="text-xs font-black uppercase tracking-widest text-white">{title}</h3>
      <ul className="mt-3 grid gap-2 text-xs text-white/50">
        {links.map((link) => (
          <li key={link}>
            <Link to={hrefs[link] || '/'} className="teamup-footer-link">{link}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
