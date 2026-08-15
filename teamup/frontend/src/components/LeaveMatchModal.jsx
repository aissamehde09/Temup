import Modal from './Modal';

export default function LeaveMatchModal({ open, onCancel, onConfirm, error, loading }) {
  return (
    <Modal open={open} title="Quitter ce match ?" onClose={onCancel}>
      <div className="space-y-5">
        <p className="text-sm text-slate-600">Ta place sera libérée pour un autre joueur.</p>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onCancel} disabled={loading} className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60">
            Annuler
          </button>
          <button type="button" onClick={onConfirm} disabled={loading} className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60">
            {loading ? 'Suppression...' : 'Quitter le match'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
