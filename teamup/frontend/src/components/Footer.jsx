import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="teamup-footer bg-[#071417] px-6 py-9 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="teamup-footer-block">
          <Link to="/" className="teamup-footer-brand flex w-fit items-center gap-2">
            <img src="/img/logo-teamup.png" alt="TeamUp" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-lg font-black text-[#F97316]">TeamUp</span>
          </Link>
          <p className="mt-3 max-w-sm text-xs leading-5 text-white/55">
            La plateforme pour rencontrer des sportifs et organiser des matchs près de chez toi.
          </p>
        </div>
        <FooterColumn title="Navigation" links={['Accueil', 'Trouver un match', 'Comment ça marche', 'À propos']} />
        <FooterColumn title="Aide" links={['FAQ', 'Contact', 'Conditions d’utilisation']} />
        <FooterColumn title="Légal" links={['Mentions légales', 'CGU', 'Politique de cookies']} />
      </div>
      <p className="teamup-footer-copy mt-7 text-center text-[11px] text-white/35">© 2026 TeamUp. Tous droits réservés.</p>
    </footer>
  );
}

function FooterColumn({ title, links }) {
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
      <h2 className="text-xs font-black uppercase tracking-widest text-white">{title}</h2>
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
