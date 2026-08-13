import { ArrowRight } from 'lucide-react';
import { Users } from './landing/icons';

export default function InviteFriendsCard({ onInvite }) {
  return (
    <div className="mt-14 rounded-2xl border border-white/12 bg-white/[0.03] p-5">
      <div className="mb-4 text-lime-500">
        <Users size={26} color="currentColor" />
      </div>
      <h2 className="text-lg font-black">Invite tes amis</h2>
      <p className="mt-4 text-sm leading-6 text-white/70">
        Plus on est de joueurs,
        <br />
        plus les matchs sont fun !
      </p>
      <button
        type="button"
        onClick={onInvite}
        className="mt-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-lime-700 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-lime-800 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-[#071417]"
      >
        Inviter un ami <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
