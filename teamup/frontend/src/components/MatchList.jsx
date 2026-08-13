import EmptyState from './EmptyState';
import MatchCard from './MatchCard';

export default function MatchList({ matches }) {
  if (!matches?.length) {
    return <EmptyState title="Aucun match trouvé" description="Essaie d’élargir tes filtres ou crée le premier match." />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

