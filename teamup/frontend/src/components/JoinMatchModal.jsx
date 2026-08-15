import Modal from './Modal';
import { formatMatchDate, formatMatchTime } from '../utils/matchDate';

export default function JoinMatchModal({ open, match, onCancel, onConfirm, error, loading }) {
  return (
    <Modal open={open} title="Rejoindre ce match ?" onClose={onCancel}>
      <div className="space-y-5">
        <div className="rounded-2xl bg-orange-50 p-4">
          <p className="text-sm font-black text-orange-600">🏀 {match.title}</p>
          <p className="mt-2 text-sm font-medium text-slate-700">
            {formatMatchDate(match)} • {formatMatchTime(match)}
          </p>
          <p className="mt-1 text-sm text-slate-500">{match.city} - {match.location}</p>
        </div>

        <p className="text-sm text-slate-600">Confirme ta participation à ce match.</p>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
            Annuler
          </button>
          <button type="button" disabled={loading} onClick={onConfirm} className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60">
            {loading ? 'Inscription...' : 'Confirmer ma participation'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
