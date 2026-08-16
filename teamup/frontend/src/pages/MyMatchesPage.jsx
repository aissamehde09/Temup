import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useMatchInteractions } from '../context/MatchInteractionContext';
import { useMatchData } from '../context/MatchDataContext';
import { MatchListRow, PagePanel, PageTitle, sportMeta } from '../components/InternalUI';
import { isPastMatch } from '../utils/matchDate';

export default function MyMatchesPage() {
  const { user } = useAuth();
  const { matches: allMatches, deleteMatch } = useMatchData();
  const { joinedIds, leftIds, leaveMatch } = useMatchInteractions();
  const [activeTab, setActiveTab] = useState('À venir');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const userId = String(user?.id || '');
  const userEmail = String(user?.email || '').toLowerCase();
  const organizedMatches = allMatches.filter((match) => (
    (match.organizer_id != null && String(match.organizer_id) === userId)
    || (match.organizer_email && String(match.organizer_email).toLowerCase() === userEmail)
  ));
  const organizedIds = new Set(organizedMatches.map((match) => String(match.id)));
  const joinedMatches = allMatches.filter((match) => (
    joinedIds.includes(String(match.id))
    && !organizedIds.has(String(match.id))
    && !leftIds.includes(String(match.id))
  ));
  const matches = [
    ...organizedMatches.filter((match) => !leftIds.includes(String(match.id))),
    ...joinedMatches,
  ]
    .filter((match, index, array) => array.findIndex((item) => item.id === match.id) === index);
  const visibleMatches = useMemo(() => {
    if (activeTab === 'Organisés') return organizedMatches;
    if (activeTab === 'Passés') return matches.filter(isPastMatch);
    return matches.filter((match) => !isPastMatch(match));
  }, [activeTab, matches, organizedMatches]);

  async function handleDelete(match) {
    if (!window.confirm(`Supprimer définitivement « ${match.title} » ?`)) return;
    setDeletingId(String(match.id));
    setDeleteError('');
    try {
      await deleteMatch(match.id);
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'Impossible de supprimer ce match.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <PagePanel className="p-7">
        <PageTitle title="Mes matchs" />

        <div className="mb-6 flex border-b border-slate-200">
          {['À venir', 'Passés', 'Organisés'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-10 pb-4 text-sm font-bold transition ${activeTab === tab ? 'border-b-2 border-lime-700 text-lime-800' : 'text-slate-500 hover:text-lime-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {deleteError && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{deleteError}</p>}
          {visibleMatches.length > 0 ? visibleMatches.map((match) => {
            const meta = sportMeta(match);
            const playersCount = Number(match.players_count || match.participants?.length || 0);
            return (
              <MatchListRow
                key={match.id}
                match={{ ...match, players_count: playersCount }}
                playersText={`${playersCount} / ${match.max_players}`}
                actions={(
                  <>
                    <Link to={`/matches/${match.id}`} className={`rounded-lg border px-6 py-2 text-sm font-black ${meta.button}`}>
                      Voir
                    </Link>
                    {activeTab === 'Organisés' && (
                      <button type="button" onClick={() => handleDelete(match)} disabled={deletingId === String(match.id)} className="rounded-lg border border-red-500 px-6 py-2 text-sm font-black text-red-600 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60">
                        {deletingId === String(match.id) ? 'Suppression…' : 'Supprimer'}
                      </button>
                    )}
                    {!organizedIds.has(String(match.id)) && activeTab !== 'Passés' && (
                      <button type="button" onClick={() => leaveMatch(match.id)} className="rounded-lg border border-orange-500 px-6 py-2 text-sm font-black text-red-600 hover:bg-red-50">
                        Quitter
                      </button>
                    )}
                  </>
                )}
              />
            );
          }) : (
            <EmptyState title="Aucun match" description={activeTab === 'Passés' ? 'Tu n’as aucun match passé.' : activeTab === 'Organisés' ? 'Tu n’as encore organisé aucun match.' : 'Tu n’as pas encore rejoint de match à venir.'} />
          )}
        </div>
      </PagePanel>
    </div>
  );
}
