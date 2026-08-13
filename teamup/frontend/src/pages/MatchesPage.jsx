import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MatchMap from '../components/MatchMap';
import ViewToggle from '../components/ViewToggle';
import { useMatchData } from '../context/MatchDataContext';
import { MatchListRow, PagePanel, PageTitle, SelectInput, TextInput, sportMeta } from '../components/InternalUI';
import { Search } from '../components/landing/icons';

export default function MatchesPage() {
  const { matches } = useMatchData();
  const [viewMode, setViewMode] = useState('list');
  const [query, setQuery] = useState('');
  const [sport, setSport] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [level, setLevel] = useState('');

  const filteredMatches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return matches.filter((match) => {
      const searchable = `${match.title} ${match.city} ${match.location}`.toLowerCase();
      return (!normalizedQuery || searchable.includes(normalizedQuery))
        && (!sport || match.sport_name === sport)
        && (!city || match.city.toLowerCase().includes(city.trim().toLowerCase()))
        && (!date || match.match_date === date)
        && (!level || match.level === level);
    });
  }, [matches, query, sport, city, date, level]);

  return (
    <div className="mx-auto max-w-[1180px]">
      <PagePanel className="p-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <PageTitle title="Trouver un match" subtitle="Trouve la partie qui te correspond." />
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>

        <div className="rounded-xl bg-white">
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
            <Search size={15} color="#64748B" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 text-sm font-medium outline-none" placeholder="Rechercher un match, une ville..." />
          </label>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <SelectInput value={sport} onChange={(event) => setSport(event.target.value)}><option value="">Sport</option><option>Football</option><option>Basketball</option></SelectInput>
            <div className="relative">
              <TextInput
                value={city}
                onChange={(event) => setCity(event.target.value)}
                list="teamup-cities"
                placeholder="Ville"
                aria-label="Ville"
                className="w-full"
              />
              <datalist id="teamup-cities">
                <option value="Nanterre" />
                <option value="Puteaux" />
                <option value="Courbevoie" />
                <option value="Levallois" />
              </datalist>
            </div>
            <TextInput type="date" aria-label="Date" value={date} onChange={(event) => setDate(event.target.value)} />
            <SelectInput value={level} onChange={(event) => setLevel(event.target.value)}><option value="">Niveau</option><option>Débutant</option><option>Intermédiaire</option><option>Confirmé</option></SelectInput>
            <button type="button" className="h-11 rounded-lg bg-lime-700 px-8 text-sm font-black text-white hover:bg-lime-800">
              Rechercher
            </button>
          </div>
        </div>

        <div className="mt-6">
          {viewMode === 'map' ? (
            filteredMatches.length ? <MatchMap matches={filteredMatches} /> : (
              <div className="grid h-[600px] place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
                <div><p className="text-lg font-black text-slate-900">Aucun match à afficher sur la carte</p><p className="mt-2 text-sm text-slate-500">Modifie les filtres pour voir les matchs.</p></div>
              </div>
            )
          ) : filteredMatches.length ? (
            filteredMatches.map((match) => {
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
            })
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-14 text-center">
              <p className="text-lg font-black text-slate-900">Aucun match trouvé</p>
              <p className="mt-2 text-sm text-slate-500">Aucun match ne correspond à tes critères.</p>
            </div>
          )}
        </div>
      </PagePanel>
    </div>
  );
}
