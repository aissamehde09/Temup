import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from '../components/landing/icons';
import { MatchListRow, PagePanel, PageTitle, sportMeta } from '../components/InternalUI';
import Loader from '../components/Loader';
import { api } from '../services/api';
import { normalizeMatch } from '../utils/matchNormalize';

export default function FavoritesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/favorites')
      .then(({ data }) => setMatches((data.matches || []).map(normalizeMatch)))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1180px]">
        <PagePanel className="p-10"><Loader label="Chargement des favoris..." /></PagePanel>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <Heart size={48} color="#e11d48" />
        <h1 className="mt-4 text-3xl font-black text-slate-950">Aucun favori</h1>
        <p className="mt-2 text-slate-500">Les matchs ajoutés aux favoris apparaîtront ici.</p>
        <Link to="/matches" className="mt-6 inline-flex rounded-2xl bg-lime-600 px-5 py-3 text-sm font-black text-white">Trouver un match</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <PagePanel className="p-7">
        <PageTitle title="Mes favoris" subtitle={`${matches.length} match${matches.length > 1 ? 's' : ''} enregistré${matches.length > 1 ? 's' : ''}.`} />
        {matches.map((match) => {
          const meta = sportMeta(match);
          return (
            <MatchListRow
              key={match.id}
              match={match}
              actions={(
                <Link to={`/matches/${match.id}`} className={`rounded-lg border px-6 py-3 text-sm font-black ${meta.button}`}>
                  Voir le match
                </Link>
              )}
            />
          );
        })}
      </PagePanel>
    </div>
  );
}
