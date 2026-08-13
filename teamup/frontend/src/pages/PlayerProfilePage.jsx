import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PagePanel } from '../components/InternalUI';
import UserAvatar from '../components/UserAvatar';
import { Basketball, Football, MapPin, MessageCircle, ShieldCheck, Star, User } from '../components/landing/icons';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { users } from '../data/mockData';
import { api } from '../services/api';
import { getAvatarSource } from '../utils/avatar';

const bios = {
  1: 'Passionné de foot et de basket. Toujours partant pour un match le week-end !',
  2: 'Joueuse régulière de basket, esprit collectif et bonne humeur avant tout.',
  3: 'Disponible pour les matchs de foot en semaine et les sessions basket du samedi.',
  4: 'Débutant motivé, toujours prêt à progresser avec une équipe sympa.',
};

const stats = {
  1: { played: 24, rating: '4.8/5' },
  2: { played: 18, rating: '4.9/5' },
  3: { played: 15, rating: '4.7/5' },
  4: { played: 9, rating: '4.6/5' },
};

export default function PlayerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getFriendStatus, sendFriendRequest, openPrivateConversation } = useSocial();
  const [serverPlayer, setServerPlayer] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('teamup_token')));
  const [notFound, setNotFound] = useState(false);
  const fallbackPlayer = users.find((item) => String(item.id) === String(id));
  const player = normalizePlayer(serverPlayer) || fallbackPlayer;
  const isMe = Boolean(user?.id && player?.id && String(user.id) === String(player.id));
  const friendStatus = player?.id ? getFriendStatus(player.id) : 'none';
  const playerStats = getPlayerStats(player, stats[player?.id]);

  useEffect(() => {
    let ignore = false;
    async function loadPlayer() {
      if (!id || !localStorage.getItem('teamup_token')) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await api.get(`/users/${id}`);
        if (!ignore) setServerPlayer(data.user);
      } catch {
        if (!ignore) setNotFound(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadPlayer();
    return () => {
      ignore = true;
    };
  }, [id]);

  function handleMessage() {
    openPrivateConversation(player);
    navigate('/messages');
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1120px]">
        <PagePanel className="p-8">
          <p className="text-sm font-semibold text-slate-500">Chargement du profil...</p>
        </PagePanel>
      </div>
    );
  }

  if (!player || notFound) {
    return (
      <div className="mx-auto max-w-[1120px]">
        <Link to="/matches" className="mb-6 inline-flex text-sm font-bold text-lime-800">← Retour</Link>
        <PagePanel className="p-8">
          <h1 className="text-2xl font-black text-slate-950">Profil introuvable</h1>
          <p className="mt-2 text-sm text-slate-500">Ce joueur n’existe pas ou n’est plus disponible.</p>
        </PagePanel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1120px]">
      <Link to="/matches" className="mb-6 inline-flex text-sm font-bold text-lime-800">← Retour</Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <PagePanel className="p-8">
          <div className="flex flex-wrap items-center gap-8">
            <UserAvatar user={player} size="lg" />
            <div>
              <h1 className="text-3xl font-black text-slate-950">{player.firstName} {player.lastName}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
                <MapPin size={14} color="currentColor" />
                {player.city}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                <ShieldCheck size={14} color="currentColor" />
                Niveau {String(player.level).toLowerCase()}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-600">{player.sports.length ? player.sports.join(' • ') : 'Aucun sport renseigné'}</p>
            </div>
          </div>

          <div className="mt-9 grid grid-cols-2 border-y border-slate-100 py-7 md:grid-cols-3">
            <ProfileStat value={playerStats.played} label="Matchs joués" />
            <ProfileStat value={playerStats.rating} label="Note moyenne" />
            <ProfileStat value={player.sports.length} label="Sports pratiqués" />
          </div>

          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <section>
              <h2 className="text-lg font-black text-slate-950">Sports</h2>
              <div className="mt-5 flex gap-4">
                {player.sports.includes('Football') && <SportCard Icon={Football} label="Football" color="#65A30D" />}
                {player.sports.includes('Basketball') && <SportCard Icon={Basketball} label="Basketball" color="#F97316" />}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black text-slate-950">À propos</h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-slate-600">{player.bio || bios[player.id] || 'Aucune présentation pour le moment.'}</p>
            </section>
          </div>
        </PagePanel>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Actions</h2>
          <div className="mt-5 grid gap-3">
            {!isMe && (
              <FriendButton status={friendStatus} onClick={() => sendFriendRequest(player)} />
            )}
            <button type="button" onClick={handleMessage} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-800 transition hover:border-lime-600 hover:text-lime-700">
              <MessageCircle size={16} color="currentColor" />
              Envoyer un message
            </button>
          </div>

          {!isMe && friendStatus === 'pending' && (
            <p className="mt-4 rounded-xl bg-lime-50 p-4 text-sm leading-6 text-lime-900">
              La demande d’amitié a été envoyée. Tu seras notifié dès qu’elle sera acceptée.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function FriendButton({ status, onClick }) {
  const labels = {
    none: 'Ajouter en ami',
    pending: 'Demande envoyée',
    accepted: 'Amis ✓',
    friends: 'Amis ✓',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status !== 'none'}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-700 px-5 py-3 text-sm font-black text-white transition hover:bg-lime-800 disabled:cursor-not-allowed disabled:bg-lime-100 disabled:text-lime-800"
    >
      <User size={16} color="currentColor" />
      {labels[status] || labels.none}
    </button>
  );
}

function ProfileStat({ value, label }) {
  return (
    <div className="border-slate-100 text-center md:border-r md:last:border-r-0">
      <p className="text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function normalizePlayer(player) {
  if (!player) return null;
  const sports = Array.isArray(player.sports)
    ? player.sports.map((sport) => (typeof sport === 'string' ? sport : sport.name)).filter(Boolean)
    : [];

  return {
    id: player.id,
    firstName: player.first_name || player.firstName || 'Utilisateur',
    lastName: player.last_name || player.lastName || 'TeamUp',
    city: player.city || 'Ville non renseignée',
    level: player.level || 'Non renseigné',
    avatar: getAvatarSource(player),
    sports,
    bio: player.bio || '',
    stats: player.stats || {},
  };
}

function getPlayerStats(player, fallback = {}) {
  const played = Number(player?.stats?.played_count ?? player?.stats?.playedCount ?? fallback.played ?? 0);
  const rating = Number(player?.stats?.average_rating ?? player?.stats?.averageRating ?? 0);
  return {
    played,
    rating: rating > 0 ? `${rating}/5` : fallback.rating || '0/5',
  };
}

function getInitials(player) {
  const initials = `${player?.firstName?.[0] || ''}${player?.lastName?.[0] || ''}`.toUpperCase();
  return initials || 'TU';
}

function SportCard({ Icon, label, color }) {
  return (
    <div className="grid h-28 w-32 place-items-center rounded-lg border border-slate-200 bg-white">
      <div className="text-center">
        <Icon size={32} color={color} />
        <p className="mt-3 text-sm font-bold text-slate-700">{label}</p>
      </div>
    </div>
  );
}
