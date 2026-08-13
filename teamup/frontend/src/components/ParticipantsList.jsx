import { Link } from 'react-router-dom';
import { getAvatarSource } from '../utils/avatar';

export default function ParticipantsList({ count, currentUser, joined, organizer = false, participants = [] }) {
  const showCurrentUser = Boolean(joined || organizer);
  const remoteParticipants = participants.filter((participant) => String(participant.id) !== String(currentUser?.id));
  const visibleParticipants = remoteParticipants.slice(0, Math.max(0, count - (showCurrentUser ? 1 : 0)));
  const extra = Math.max(0, count - visibleParticipants.length - (showCurrentUser ? 1 : 0));

  return (
    <div className="flex flex-wrap items-end gap-2">
      {visibleParticipants.map((participant, index) => {
        const src = getAvatarSource(participant);
        const alt = `${participant.first_name || participant.firstName || ''} ${participant.last_name || participant.lastName || ''}`.trim() || 'Participant';
        const avatar = src ? (
          <img
            src={src}
            alt={alt}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
          />
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-700 ring-2 ring-white">
            {getInitials({
              firstName: participant.first_name || participant.firstName,
              lastName: participant.last_name || participant.lastName,
            })}
          </span>
        );

        return (
          <Link key={participant.id || index} to={`/players/${participant.id}`} className="transition hover:-translate-y-0.5" title={alt}>
            {avatar}
          </Link>
        );
      })}

      {showCurrentUser && (
        <div className="relative">
          {getAvatarSource(currentUser) ? (
            <img
              src={getAvatarSource(currentUser)}
              alt={currentUser.firstName || currentUser.first_name || 'Utilisateur'}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-lime-700"
            />
          ) : (
            <span className="grid h-10 w-10 place-items-center rounded-full bg-lime-100 text-sm font-black text-lime-800 ring-2 ring-lime-700">
              {getInitials(currentUser)}
            </span>
          )}
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-lime-700 px-2 py-0.5 text-[10px] font-black text-white">
            {organizer ? 'Moi' : 'Moi'}
          </span>
        </div>
      )}

      {extra > 0 && (
        <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-600">
          +{extra}
        </span>
      )}
    </div>
  );
}

function getInitials(user) {
  const initials = `${user?.firstName?.[0] || user?.first_name?.[0] || ''}${user?.lastName?.[0] || user?.last_name?.[0] || ''}`.toUpperCase();
  return initials || 'TU';
}
