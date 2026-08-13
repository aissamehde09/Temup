import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    if (window.location.hash === '#about') return 'about';
    if (window.location.hash === '#how') return 'how';
    return 'top';
  });

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleHomeClick = () => {
    setActiveSection('top');
    closeMenu();
  };

  return (
    <header className={`teamup-navbar teamup-navbar-light relative sticky top-0 z-30 border-b border-slate-100 bg-white px-4 py-3 text-slate-800 sm:px-6 lg:px-8 ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <Link to="/" onClick={handleHomeClick} className="teamup-brand flex shrink-0 items-center gap-3">
          <img src="/img/logo-teamup.png" alt="TeamUp" className="h-12 w-12 rounded-full object-cover" />
          <span className="text-2xl font-bold text-slate-950">TeamUp</span>
        </Link>

        <nav className="hidden items-center gap-5 font-bold lg:flex lg:gap-8">
          <Link to="/" onClick={handleHomeClick} className={`teamup-nav-link ${activeSection === 'top' ? 'is-active' : ''}`}>Accueil</Link>
          <a href="/#about" onClick={() => { setActiveSection('about'); closeMenu(); }} className={`teamup-nav-link ${activeSection === 'about' ? 'is-active' : ''}`}>À propos</a>
          <a href="/#how" onClick={() => { setActiveSection('how'); closeMenu(); }} className={`teamup-nav-link ${activeSection === 'how' ? 'is-active' : ''}`}>Comment ça marche</a>
        </nav>

        <div className="flex items-center gap-3 lg:gap-5">
          <Link to="/login" onClick={closeMenu} className="teamup-login-link hidden font-semibold text-slate-700 lg:inline-flex">Se connecter</Link>
          <Link to="/register" onClick={closeMenu} className="teamup-register-button hidden rounded-full bg-[#65A30D] px-4 py-3 font-bold text-white transition hover:bg-[#4d7c0f] lg:inline-flex">
            S’inscrire gratuitement
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-800 transition hover:border-[#65A30D] hover:text-[#4d7c0f] lg:hidden"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={24} strokeWidth={2.25} /> : <Menu size={24} strokeWidth={2.25} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1" aria-label="Navigation mobile et tablette">
            <Link to="/" onClick={handleHomeClick} className="rounded-lg px-3 py-3 font-semibold text-slate-700 hover:bg-slate-50">Accueil</Link>
            <a href="/#about" onClick={() => { setActiveSection('about'); closeMenu(); }} className="rounded-lg px-3 py-3 font-semibold text-slate-700 hover:bg-slate-50">À propos</a>
            <a href="/#how" onClick={() => { setActiveSection('how'); closeMenu(); }} className="rounded-lg px-3 py-3 font-semibold text-slate-700 hover:bg-slate-50">Comment ça marche</a>
            <Link to="/login" onClick={closeMenu} className="mt-2 rounded-lg border border-slate-200 px-3 py-3 text-center font-semibold text-slate-700 hover:border-[#65A30D]">Se connecter</Link>
            <Link to="/register" onClick={closeMenu} className="mt-2 rounded-lg bg-[#65A30D] px-3 py-3 text-center font-bold text-white hover:bg-[#4d7c0f]">S’inscrire gratuitement</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
