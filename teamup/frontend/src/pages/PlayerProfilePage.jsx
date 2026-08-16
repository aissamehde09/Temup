import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PagePanel, PageTitle } from '../components/InternalUI';
import UserAvatar from '../components/UserAvatar';
import { Basketball, Football, MapPin, MessageCircle, ShieldCheck, User } from '../components/landing/icons';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { api, getErrorMessage } from '../services/api';
import { getAvatarSource } from '../utils/avatar';
import { normalizeUser } from '../utils/matchNormalize';
import EmptyState from '../components/EmptyState';

export default function PlayerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openPrivateConversation } = useSocial();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Identifiant de joueur introuvable.');
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError('');

    api.get(`/players/${id}`)
      .then(({ data }) => {
        if (!active) return;
        setPlayer(normalizeUser(data.player));
      })
      .catch((requestError) => {
        if (!active) return;
        setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1180px]">
        <PagePanel className="p-8">
          <EmptyState title="Chargement du profil" description="Récupération des informations du joueur..." />
        </PagePanel>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="mx-auto max-w-[1180px]">
        <Link to="/matches" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-lime-800">
          ← Retour
        </Link>
        <PagePanel className="p-8">
          <EmptyState title="Joueur introuvable" description={error || 'Ce profil est introuvable.'} />
        </PagePanel>
      </div>
    );
  }

  const firstName = player.first_name || player.firstName || '';
  const lastName = player.last_name || player.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Utilisateur TeamUp';
  const avatar = getAvatarSource(player);
  const city = player.city || 'Ville non renseignée';
  const level = player.level || '';
  const bio = player.bio || 'Aucune présentation pour le moment.';
  const sports = Array.isArray(player.sports)
    ? player.sports.map((sport) => (typeof sport === 'string' ? sport : sport?.name || sport?.label || '')).filter(Boolean)
    : [];
  const played = Number(player.stats?.played_count || player?.stats?.playedCount || 0);
  const rating = Number(player.stats?.average_rating || player?.stats?.averageRating || 0);
  const friendStatus = player.friendStatus || 'none';
  const isOwnProfile = user?.id === player.id;
  const username = createUsername(firstName, lastName, player.email);

  function handleAddFriend() {
    if (friendStatus !== 'none') return;
    api.post(`/players/${player.id}/friend-request`)
      .then(() => setPlayer((current) => (current ? { ...current, friendStatus: 'pending' } : current)))
      .catch(() => {});
  }

  function handleMessage() {
    const conversationId = openPrivateConversation({
      id: player.id,
      first_name: firstName,
      last_name: lastName,
      avatar_url: avatar,
      city,
    });
    if (conversationId) {
      navigate('/messages');
    }
  }

  function getActionButton() {
    if (isOwnProfile) return null;

    switch (friendStatus) {
      case 'friends':
        return (
          <button type="button" disabled className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700">
            Ami(e)
          </button>
        );
      case 'pending':
        return (
          <button type="button" disabled className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700">
            Demande envoyée
          </button>
        );
      default:
        return (
          <button type="button" onClick={handleAddFriend} className="rounded-lg bg-lime-700 px-5 py-2.5 text-sm font-black text-white hover:bg-lime-800">
            Ajouter ami(e)
          </button>
        );
    }
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <Link to="/matches" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-lime-800">
        ← Retour
      </Link>

      <PagePanel className="p-8">
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <UserAvatar
              user={{ ...player, avatar_url: avatar, first_name: firstName, last_name: lastName }}
              size="xl"
              className="ring-4 shadow-sm"
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-950">{fullName}</h1>
              {friendStatus === 'friends' && (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-lime-500 text-xs font-black text-white">✓</span>
              )}
            </div>
            <p className="mt-2 text-base font-medium text-slate-500">{username}</p>
            <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
              <MapPin size={14} color="currentColor" />
              {city}
            </p>
            {level && (
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                <ShieldCheck size={14} color="currentColor" />
                Niveau {level.toLowerCase()}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {getActionButton()}
          {!isOwnProfile && friendStatus !== 'pending' && friendStatus !== 'none' && (
            <button
              type="button"
              onClick={handleMessage}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
            >
              <MessageCircle size={15} color="currentColor" />
              Message
            </button>
          )}
        </div>

        <div className="mt-9 grid grid-cols-2 border-y border-slate-100 py-7 md:grid-cols-4">
          <StatBlock value={played} label="Matchs joués" />
          <StatBlock value={sports.length} label="Sports" />
          <StatBlock value={rating > 0 ? `${rating.toFixed(1)}/5` : '0/5'} label="Note" />
          {isOwnProfile && <StatBlock value="—" label="Amis" />}
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <section>
            <h2 className="text-lg font-black text-slate-950">Sports</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {sports.length > 0 ? (
                sports.map((sport) => {
                  const isBasket = sport.toLowerCase().includes('basket');
                  return (
                    <span
                      key={sport}
                      className="grid h-12 w-12 place-items-center rounded-full"
                      style={{ backgroundColor: isBasket ? '#F9731614' : '#65A30D14', color: isBasket ? '#F97316' : '#65A30D' }}
                    >
                      {isBasket ? <Basketball size={24} /> : <Football size={24} />}
                    </span>
                  );
                })
              ) : (
                <p className="rounded-xl border border-dashed border-slate-200 px-5 py-4 text-sm font-medium text-slate-500">
                  Aucun sport renseigné.
                </p>
              )}
            </div>
          </section>
          <section>
            <h2 className="text-lg font-black text-slate-950">À propos</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">{bio}</p>
          </section>
        </div>
      </PagePanel>
    </div>
  );
}

function createUsername(firstName, lastName, email) {
  const source = [firstName, lastName].filter(Boolean).join('_') || email?.split('@')[0] || 'teamup_user';
  const normalized = source
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return `@${normalized || 'teamup_user'}`;
}

function StatBlock({ value, label }) {
  return (
    <div className="text-center md:border-r md:last:border-r-0">
      <p className="text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}
