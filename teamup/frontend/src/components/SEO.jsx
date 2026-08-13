import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const defaultDescription =
  'TeamUp permet de trouver des joueurs de football ou basketball près de chez toi, rejoindre des matchs et organiser tes propres parties.';

const pages = {
  '/': {
    title: 'TeamUp - Trouve des joueurs de foot et basket près de chez toi',
    description: defaultDescription,
  },
  '/login': {
    title: 'Connexion - TeamUp',
    description: 'Connecte-toi à TeamUp pour rejoindre ou organiser un match de foot ou basket.',
  },
  '/register': {
    title: 'Inscription gratuite - TeamUp',
    description: 'Crée ton compte TeamUp gratuitement et complète ton profil sportif.',
  },
  '/dashboard': {
    title: 'Tableau de bord - TeamUp',
    description: 'Consulte tes matchs, tes notifications et ton activité sportive sur TeamUp.',
  },
  '/matches': {
    title: 'Trouver un match - TeamUp',
    description: 'Recherche des matchs de football ou basketball par ville, niveau et date.',
  },
  '/matches/create': {
    title: 'Créer un match - TeamUp',
    description: 'Organise un match de football ou basketball et invite des joueurs près de chez toi.',
  },
  '/my-matches': {
    title: 'Mes matchs - TeamUp',
    description: 'Retrouve tes matchs à venir, passés et organisés sur TeamUp.',
  },
  '/notifications': {
    title: 'Notifications - TeamUp',
    description: 'Suis les invitations, participations et mises à jour de tes matchs TeamUp.',
  },
  '/messages': {
    title: 'Messages - TeamUp',
    description: 'Échange avec les joueurs et organisateurs de matchs sur TeamUp.',
  },
  '/profile': {
    title: 'Profil - TeamUp',
    description: 'Consulte et modifie ton profil sportif TeamUp.',
  },
  '/settings': {
    title: 'Paramètres - TeamUp',
    description: 'Gère ton compte, ta sécurité et tes préférences TeamUp.',
  },
  '/faq': {
    title: 'FAQ - TeamUp',
    description: 'Réponses aux questions fréquentes sur TeamUp.',
  },
  '/contact': {
    title: 'Contact - TeamUp',
    description: 'Contacte l’équipe TeamUp pour une question, une suggestion ou un problème.',
  },
  '/terms': {
    title: 'Conditions d’utilisation - TeamUp',
    description: 'Consulte les règles d’utilisation de la plateforme TeamUp.',
  },
  '/legal': {
    title: 'Mentions légales - TeamUp',
    description: 'Informations légales concernant l’éditeur du site TeamUp.',
  },
  '/cgu': {
    title: 'CGU - TeamUp',
    description: 'Conditions Générales d’Utilisation de TeamUp.',
  },
  '/cookies': {
    title: 'Politique de cookies - TeamUp',
    description: 'Informations sur l’utilisation des cookies par TeamUp.',
  },
};

function setMeta(name, content, attribute = 'name') {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export default function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = pages[pathname] || (pathname.startsWith('/matches/') ? {
      title: 'Détail du match - TeamUp',
      description: 'Consulte les détails d’un match TeamUp, ses participants et les places disponibles.',
    } : pages['/']);

    document.title = page.title;
    setMeta('description', page.description);
    setMeta('og:title', page.title, 'property');
    setMeta('og:description', page.description, 'property');
    setMeta('twitter:title', page.title);
    setMeta('twitter:description', page.description);
  }, [pathname]);

  return null;
}
