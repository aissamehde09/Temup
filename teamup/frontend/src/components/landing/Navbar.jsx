import { Link } from 'react-router-dom';
import Button from './Button';

const navItems = [
  ['Accueil', '#top'],
  ['Trouver un match', '#matches'],
  ['Comment ça marche', '#how'],
  ['À propos', '#about'],
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071417]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="TeamUp accueil">
          <img src="/img/logo-teamup.png" alt="TeamUp" className="h-12 w-12 rounded-full bg-white/10 object-cover ring-1 ring-white/15" />
          <span className="sr-only">TeamUp</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/75 lg:flex">
          {navItems.map(([label, href]) => (
            <a key={label} href={href} className="group relative transition hover:text-white">
              {label}
              <span className="absolute -bottom-2 left-0 h-0.5 w-0 rounded-full bg-[#65A30D] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden text-sm font-bold text-white/80 transition hover:text-white sm:inline-flex">
            Se connecter
          </Link>
          <Button to="/register" className="px-4 py-2.5 sm:px-5">
            S'inscrire gratuitement
          </Button>
        </div>
      </div>
    </header>
  );
}

