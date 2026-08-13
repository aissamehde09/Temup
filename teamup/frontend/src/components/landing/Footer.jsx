import { Facebook, Instagram, Twitter, Youtube } from './icons';

const groups = [
  ['Navigation', ['Accueil', 'Trouver un match', 'Comment ça marche', 'À propos']],
  ['Compte', ['Créer un compte', 'Se connecter', 'Mon profil']],
  ['Informations', ['FAQ', 'Contact', 'Mentions légales', 'Politique de confidentialité', 'CGU']],
];

export default function Footer() {
  return (
    <footer className="bg-[#071417] px-5 py-14 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <img src="/img/logo-teamup.png" alt="TeamUp" className="h-14 w-14 rounded-full bg-white/10 object-cover" />
          <p className="mt-5 max-w-sm leading-7 text-white/60">
            TeamUp connecte les passionnés de football et de basketball pour jouer ensemble près de chez eux.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, index) => (
              <a key={index} href="#" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/65 transition hover:border-[#65A30D] hover:text-white">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {groups.map(([title, links]) => (
          <div key={title}>
            <h3 className="font-black">{title}</h3>
            <ul className="mt-5 grid gap-3 text-sm text-white/55">
              {links.map((link) => (
                <li key={link}><a href="#" className="transition hover:text-[#65A30D]">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-7xl text-sm text-white/40">© 2026 TeamUp. Tous droits réservés.</p>
    </footer>
  );
}
