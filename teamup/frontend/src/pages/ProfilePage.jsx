import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PagePanel } from '../components/InternalUI';
import UserAvatar from '../components/UserAvatar';
import { Basketball, Football, MapPin, MessageCircle, ShieldCheck, User } from '../components/landing/icons';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';

export default function ProfilePage() {
  const { user, updateAvatar } = useAuth();
  const { friends, openPrivateConversation } = useSocial();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [photoError, setPhotoError] = useState('');
  const firstName = getUserValue(user, 'first_name', 'firstName');
  const lastName = getUserValue(user, 'last_name', 'lastName');
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Utilisateur TeamUp';
  const avatar = getUserValue(user, 'avatar_url', 'avatarUrl') || user?.avatar || '';
  const city = getUserValue(user, 'city', 'city') || 'Ville non renseignée';
  const level = getUserValue(user, 'level', 'level');
  const username = createUsername(firstName, lastName, user?.email);
  const sports = getUserSports(user);
  const stats = getUserStats(user);
  const bio = getUserValue(user, 'bio', 'bio') || 'Aucune présentation pour le moment.';

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Choisis un fichier image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('La photo doit faire moins de 5 Mo.');
      return;
    }
    setPhotoError('');
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await updateAvatar(reader.result);
      } catch {
        setPhotoError('Impossible d’enregistrer la photo. Vérifie que le serveur est démarré.');
      }
    };
    reader.readAsDataURL(file);
  }

  function openMessage(friend) {
    openPrivateConversation(friend);
    navigate('/messages');
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <PagePanel className="p-8">
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <UserAvatar user={{ ...user, avatar_url: avatar, first_name: firstName, last_name: lastName }} size="xl" className="ring-4 shadow-sm" />
              <button type="button" onClick={() => inputRef.current?.click()} className="absolute bottom-1 right-1 grid h-10 w-10 place-items-center rounded-full bg-lime-700 text-xl text-white shadow-lg transition hover:bg-lime-800" aria-label="Modifier la photo de profil" title="Modifier la photo de profil">
                ✎
              </button>
              <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoChange} className="sr-only" />
            </div>
            {avatar && (
              <button
                type="button"
                onClick={() => updateAvatar(null).catch(() => setPhotoError('Impossible de supprimer la photo pour le moment.'))}
                className="text-xs font-bold text-red-600 underline underline-offset-2 hover:text-red-700"
              >
                Supprimer la photo
              </button>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-950">{fullName}</h1>
            <p className="mt-2 text-base font-medium text-slate-500">{username}</p>
            <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
              <MapPin size={14} color="currentColor" />
              {city}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
              <ShieldCheck size={14} color="currentColor" />
              {level ? `Niveau ${level.toLowerCase()}` : 'Niveau non renseigné'}
            </p>
          </div>
        </div>
        {photoError && <p className="mt-3 text-sm font-semibold text-red-600">{photoError}</p>}

        <div className="mt-9 grid grid-cols-2 border-y border-slate-100 py-7 md:grid-cols-4">
          <ProfileStat value={stats.played} label="Matchs joués" />
          <ProfileStat value={stats.organized} label="Matchs organisés" />
          <ProfileStat value={stats.participations} label="Participations" />
          <ProfileStat value={stats.averageRating} label="Note moyenne" />
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <section>
            <h2 className="text-lg font-black text-slate-950">Mes sports</h2>
            <div className="mt-5 flex gap-4">
              {sports.length > 0 ? (
                sports.map((sport) => (
                  <SportCard
                    key={sport}
                    Icon={sport.toLowerCase().includes('basket') ? Basketball : Football}
                    label={sport}
                    color={sport.toLowerCase().includes('basket') ? '#F97316' : '#65A30D'}
                  />
                ))
              ) : (
                <p className="rounded-xl border border-dashed border-slate-200 px-5 py-4 text-sm font-medium text-slate-500">
                  Aucun sport renseigné.
                </p>
              )}
            </div>
          </section>
          <section>
            <h2 className="text-lg font-black text-slate-950">À propos</h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-600">
              {bio}
            </p>
          </section>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-black text-slate-950">Mes amis</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {friends.map((friend, index) => (
              <article key={friend.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="relative">
                    <UserAvatar user={friend} size="md" />
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${index % 2 === 0 ? 'bg-lime-500' : 'bg-slate-300'}`} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black text-slate-950">{friend.firstName} {friend.lastName}</h3>
                    <p className="text-xs font-medium text-slate-500">{index % 2 === 0 ? 'En ligne' : 'Hors ligne'}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link to={`/players/${friend.id}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:border-lime-600 hover:text-lime-700">
                    <User size={13} color="currentColor" />
                    Profil
                  </Link>
                  <button type="button" onClick={() => openMessage(friend)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-lime-700 px-3 py-2 text-xs font-black text-white hover:bg-lime-800">
                    <MessageCircle size={13} color="currentColor" />
                    Message
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </PagePanel>
    </div>
  );
}

function getUserValue(user, snakeKey, camelKey) {
  return user?.[snakeKey] || user?.[camelKey] || '';
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

function getInitials(firstName, lastName) {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  return initials || 'TU';
}

function getUserSports(user) {
  if (!Array.isArray(user?.sports)) return [];

  return user.sports
    .map((sport) => {
      if (typeof sport === 'string') return sport;
      return sport?.name || sport?.label || '';
    })
    .filter(Boolean);
}

function getUserStats(user) {
  const rawStats = user?.stats || {};
  const organized = toNumber(rawStats.organized_count ?? rawStats.organizedCount);
  const participations = toNumber(rawStats.participations_count ?? rawStats.participationsCount);
  const played = toNumber(rawStats.played_count ?? rawStats.playedCount ?? participations);
  const averageRating = toNumber(rawStats.average_rating ?? rawStats.averageRating);

  return {
    played,
    organized,
    participations,
    averageRating: averageRating > 0 ? `${averageRating}/5` : '0/5',
  };
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function ProfileStat({ value, label }) {
  return (
    <div className="border-slate-100 text-center md:border-r md:last:border-r-0">
      <p className="text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
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
