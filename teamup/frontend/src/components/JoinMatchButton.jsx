import { ArrowRight, Logout } from './landing/icons';

export default function JoinMatchButton({ joined, full, organizer, onJoin, onLeave }) {
  if (organizer) {
    return <button type="button" disabled className="flex items-center justify-center rounded-lg bg-slate-100 px-6 py-4 text-sm font-black text-slate-500">Tu es l’organisateur</button>;
  }
  if (full && !joined) {
    return (
      <button disabled className="flex items-center justify-center rounded-lg bg-slate-200 px-6 py-4 text-sm font-black text-slate-500">
        Match complet
      </button>
    );
  }

  if (joined) {
    return (
      <button
        type="button"
        onClick={onLeave}
        className="flex items-center justify-center gap-3 rounded-lg border border-orange-500 bg-white px-6 py-4 text-sm font-black text-orange-600 hover:bg-orange-50"
      >
        <Logout size={15} color="currentColor" />
        Quitter le match
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onJoin}
      className="flex items-center justify-center gap-3 rounded-lg bg-orange-500 px-6 py-4 text-sm font-black text-white hover:bg-orange-600"
    >
      <ArrowRight size={15} color="currentColor" />
      Rejoindre le match
    </button>
  );
}
