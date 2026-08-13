import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import JoinMatchButton from '../components/JoinMatchButton';
import JoinMatchModal from '../components/JoinMatchModal';
import LeaveMatchModal from '../components/LeaveMatchModal';
import ParticipantsList from '../components/ParticipantsList';
import SuccessToast from '../components/SuccessToast';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getErrorMessage } from '../services/api';
import { useMatchInteractions } from '../context/MatchInteractionContext';
import { useMatchData } from '../context/MatchDataContext';
import { MetaItem, PagePanel, RemainingPlaces, SportBadge } from '../components/InternalUI';
import { CalendarDays, Clock, MapPin, ShieldCheck, Star } from '../components/landing/icons';
import UserAvatar from '../components/UserAvatar';
import { getAvatarSource } from '../utils/avatar';

function formatMatchDate(value) {
  if (!value) return 'Date non renseignée';
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default function MatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { matches } = useMatchData();
  const { joinMatch, leaveMatch, toggleFavorite, isJoined, isFavorite } = useMatchInteractions();
  const fallbackMatch = matches.find((item) => String(item.id) === String(id)) || matches[0];
  const [matchDetails, setMatchDetails] = useState(null);
  const match = matchDetails || fallbackMatch;
  const joined = isJoined(match.id);
  const isOrganizer = Boolean(user?.id && match.organizer_id && String(user.id) === String(match.organizer_id));
  const favorite = isFavorite(match.id);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [toast, setToast] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joining, setJoining] = useState(false);
  const participantsCount = matchDetails
    ? Number(match.players_count)
    : Number(match.players_count) + (joined ? 1 : 0);
  const matchWithCount = { ...match, players_count: participantsCount };
  const placesLeft = Number(match.max_players) - participantsCount;
  const isFull = placesLeft <= 0;
  const currentUser = {
    id: user?.id || 10,
    firstName: user?.first_name || user?.firstName || 'Moi',
    lastName: user?.last_name || user?.lastName || '',
    avatar: getAvatarSource(user || {}),
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!id || !localStorage.getItem('teamup_token')) return;
    api.get(`/matches/${id}`).then(({ data }) => setMatchDetails(data.match)).catch(() => {});
  }, [id]);

  function requestJoin() {
    if (!user) {
      navigate('/login', { state: { redirectTo: `/matches/${match.id}` } });
      return;
    }
    setJoinError('');
    setShowJoinModal(true);
  }

  async function confirmJoin() {
    setJoining(true);
    setJoinError('');
    try {
      const updatedMatch = await joinMatch(match.id);
      if (updatedMatch) setMatchDetails(updatedMatch);
      setShowJoinModal(false);
      setToast(`Tu as rejoint ${match.title} !`);
    } catch (error) {
      setJoinError(getErrorMessage(error));
    } finally {
      setJoining(false);
    }
  }

  function confirmLeave() {
    leaveMatch(match.id);
    setShowLeaveModal(false);
    setToast(`Tu as quitté ${match.title}.`);
  }

  return (
    <div className="mx-auto max-w-[1040px]">
      <SuccessToast message={toast} onClose={() => setToast('')} />

      <Link to="/matches" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-lime-800">
        ← Retour
      </Link>

      <PagePanel className="p-7">
        <div className="grid gap-7 lg:grid-cols-[1fr_310px]">
          <section>
            <img src={match.image_url} alt={match.title} className="h-72 w-full rounded-lg object-cover" />
            <div className="mt-5">
              <SportBadge match={match} />
              <h1 className="mt-2 text-2xl font-black text-slate-950">{match.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-2">
<UserAvatar user={{
  id: match.organizer_id || match.organizer?.id,
  avatar_url: match.organizer_avatar_url,
  first_name: match.organizer_first_name || 'Organisateur',
}} size="sm" />
                  <span className="text-sm font-medium text-slate-600">Organisé par {match.organizer_first_name || 'Julien'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Star size={15} color="#F97316" />
                  4.8 (34)
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="grid gap-7">
              <MetaItem Icon={CalendarDays} title="Date" value={formatMatchDate(match.match_date)} />
              <MetaItem Icon={Clock} title="Heure" value={String(match.match_time).slice(0, 5)} />
              <MetaItem Icon={MapPin} title="Lieu" value={`${match.city} - ${match.location}`} />
              <MetaItem Icon={ShieldCheck} title="Niveau" value={match.level} />
            </div>
          </aside>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_310px]">
          <section>
            <h2 className="text-lg font-black text-slate-950">À propos du match</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {match.description || 'Match détente entre passionnés. Bonne humeur garantie !'}
            </p>

            <h2 className="mt-7 text-lg font-black text-slate-950">Participants ({participantsCount}/{match.max_players})</h2>
            <div className="mt-4 pb-4">
              <ParticipantsList
                count={participantsCount}
                currentUser={currentUser}
                joined={joined}
                organizer={isOrganizer}
                participants={match.participants}
              />
            </div>
          </section>

          <div className="self-end">
            <RemainingPlaces match={matchWithCount} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <JoinMatchButton joined={joined} full={isFull} organizer={isOrganizer} onJoin={requestJoin} onLeave={() => setShowLeaveModal(true)} />
          <FavoriteButton active={favorite} onClick={() => toggleFavorite(match.id)} />
        </div>
      </PagePanel>

      <JoinMatchModal
        open={showJoinModal}
        match={match}
        onCancel={() => setShowJoinModal(false)}
        onConfirm={confirmJoin}
        error={joinError}
        loading={joining}
      />
      <LeaveMatchModal
        open={showLeaveModal}
        onCancel={() => setShowLeaveModal(false)}
        onConfirm={confirmLeave}
      />
    </div>
  );
}
