import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const pages = {
  '/faq': {
    title: 'FAQ', subtitle: 'Trouve rapidement les réponses aux questions les plus courantes.', image: '/img/teamup-basketball-original.png',
    items: [['Qu’est-ce que TeamUp ?', 'TeamUp est une plateforme qui permet de trouver des joueurs près de chez toi et d’organiser des matchs.'], ['Comment créer un compte ?', 'Clique sur S’inscrire gratuitement puis complète ton profil sportif.'], ['Comment créer un match ?', 'Depuis le menu Créer un match, renseigne le sport, le lieu et la date.'], ['Comment rejoindre un match ?', 'Ouvre sa fiche et clique sur Rejoindre le match.'], ['L’inscription est-elle payante ?', 'Non, l’utilisation de TeamUp est gratuite.']],
  },
  '/contact': { title: 'Contact', subtitle: 'Une question, une suggestion ou un problème ? L’équipe TeamUp est là pour t’aider.', image: '/img/teamup-football-original.png' },
  '/terms': { title: 'Conditions d’utilisation', subtitle: 'Les règles d’utilisation de la plateforme TeamUp.', document: true, sections: [['1. Objet', 'Les présentes conditions définissent les modalités d’accès et d’utilisation de la plateforme TeamUp.'], ['2. Accès au service', 'L’accès à TeamUp est gratuit. Certaines fonctionnalités peuvent être proposées en option.'], ['3. Utilisation de la plateforme', 'L’utilisateur s’engage à utiliser la plateforme de manière loyale et conformément à sa destination.']] },
  '/legal': { title: 'Mentions légales', subtitle: 'Informations légales concernant l’éditeur du site TeamUp.', legal: true },
  '/cgu': { title: 'CGU', subtitle: 'Conditions Générales d’Utilisation de TeamUp.', document: true, sections: [['1. Objet', 'Les présentes CGU définissent les conditions d’accès et d’utilisation de la plateforme.'], ['2. Accès au service', 'L’inscription est gratuite. TeamUp se réserve le droit de proposer des services payants.'], ['3. Utilisation de la plateforme', 'L’utilisateur s’engage à utiliser le service conformément à sa destination.']] },
  '/cookies': { title: 'Politique de cookies', subtitle: 'Comment TeamUp utilise les cookies.', document: true, image: '/img/teamup-basketball-gym-original.png', sections: [['1. Qu’est-ce qu’un cookie ?', 'Un cookie est un petit fichier texte déposé sur ton appareil lors de la visite d’un site.'], ['2. Cookies utilisés', 'TeamUp utilise des cookies nécessaires au fonctionnement du site ainsi que des cookies analytiques.'], ['3. Gestion des cookies', 'Tu peux gérer ou supprimer les cookies depuis les paramètres de ton navigateur.']] },
};

export default function InfoPage() {
  const { pathname } = useLocation();
  const page = pages[pathname] || pages['/faq'];
  return <main className="bg-slate-50 px-5 py-10 md:px-8 md:py-14"><div className="mx-auto max-w-6xl">{page.document || page.legal ? <DocumentPage page={page} /> : page.title === 'Contact' ? <ContactPage page={page} /> : <FaqPage page={page} />}</div></main>;
}

function Hero({ page }) {
  return <div className="grid items-center gap-8 rounded-3xl bg-white px-7 py-8 md:grid-cols-[1fr_260px] md:px-12"><div><h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">{page.title}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{page.subtitle}</p></div>{page.image && <img src={page.image} alt={`Illustration ${page.title} TeamUp`} className="h-36 w-full rounded-2xl object-cover shadow-sm" />}</div>;
}

function FaqPage({ page }) {
  return <><Hero page={page} /><section className="mt-6 grid gap-3">{page.items.map(([title, text], index) => <details key={title} open={index === 0} className="group rounded-xl border border-slate-200 bg-white px-5 py-4"><summary className="cursor-pointer list-none text-sm font-black text-slate-900">{title}<span className="float-right text-lime-700">⌄</span></summary><p className="mt-3 max-w-2xl text-xs leading-6 text-slate-500">{text}</p></details>)}</section></>;
}

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'contact@teamup.app';

function ContactPage({ page }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  function update(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); }
  function submit(event) {
    event.preventDefault();
    const subject = form.subject || 'Message depuis TeamUp';
    const body = `Nom : ${form.name}\nE-mail : ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }
  return <><Hero page={page} /><div className="mt-6 grid gap-5 md:grid-cols-[1.15fr_.85fr]"><section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-black">Nous écrire</h2><p className="mt-2 text-xs text-slate-500">Remplis le formulaire ci-dessous, nous te répondrons rapidement.</p><form onSubmit={submit} className="mt-5 grid gap-3"><label className="grid gap-1 text-xs font-bold text-slate-600">Nom complet<input required name="name" value={form.name} onChange={update} className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-950" placeholder="Ex : Mehdi Benabid" /></label><label className="grid gap-1 text-xs font-bold text-slate-600">Adresse e-mail<input required type="email" name="email" value={form.email} onChange={update} className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-950" placeholder="exemple@email.com" /></label><label className="grid gap-1 text-xs font-bold text-slate-600">Sujet<select required name="subject" value={form.subject} onChange={update} className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-950"><option value="">Sélectionne un sujet</option><option>Question générale</option><option>Problème technique</option></select></label><label className="grid gap-1 text-xs font-bold text-slate-600">Message<textarea required name="message" value={form.message} onChange={update} className="min-h-28 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-950" placeholder="Écris ton message..." /></label><button type="submit" className="rounded-lg bg-lime-700 py-3 text-sm font-black text-white hover:bg-lime-800">Envoyer le message →</button>{sent && <p className="rounded-lg bg-lime-50 px-3 py-2 text-xs font-bold text-lime-800">Ton logiciel de messagerie va s’ouvrir pour envoyer le message.</p>}</form></section><aside className="grid gap-5"><section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-black">Autres moyens de contact</h2><p className="mt-5 text-sm font-bold">✉ E-mail</p><a href="mailto:laurentcabinet74@gmail.com" className="text-xs text-lime-700 hover:underline">laurentcabinet74@gmail.com</a><p className="mt-4 text-sm font-bold">◎ Instagram</p><p className="text-xs text-slate-500">@teamup.app</p><p className="mt-4 text-sm font-bold">♪ TikTok</p><p className="text-xs text-slate-500">@teamup.app</p></section><section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-black">Réponse rapide</h2><p className="mt-2 text-xs leading-5 text-slate-500">Notre équipe répond en général sous 24 heures ouvrées.</p></section></aside></div></>;
}

function DocumentPage({ page }) {
  if (page.legal) return <><Hero page={page} /><section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6"><div className="grid gap-4 text-sm md:grid-cols-[160px_1fr]">{[['Éditeur du site', 'Mehdi Benabid'], ['Nature du projet', 'Projet réalisé dans le cadre de la formation au Titre Professionnel Développeur Web et Web Mobile (DWWM)'], ['Nom du projet', 'TeamUp'], ['Directeur de la publication', 'Mehdi Benabid'], ['Contact', 'Utilise le formulaire de contact du site'], ['Hébergement du front-end', 'Vercel'], ['Hébergement du back-end', 'Railway']].map(([key, value]) => <div key={key} className="contents"><strong className="border-b border-slate-100 py-3 text-slate-700">{key}</strong><span className="border-b border-slate-100 py-3 text-slate-500">{value}</span></div>)}</div></section></>;
  return <><Hero page={page} /><section className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 md:p-10">{page.sections.map(([title, text]) => <section key={title} className="mb-8 last:mb-0"><h2 className="text-base font-black text-lime-800">{title}</h2><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></section>)}<Link to="/" className="mt-2 inline-flex rounded-lg bg-lime-700 px-4 py-2 text-xs font-black text-white">← Retour à l’accueil</Link></section></>;
}
