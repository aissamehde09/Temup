import Modal from './Modal';

export default function LeaveMatchModal({ open, onCancel, onConfirm }) {
  return (
    <Modal open={open} title="Quitter ce match ?" onClose={onCancel}>
      <div className="space-y-5">
        <p className="text-sm text-slate-600">Ta place sera libérée pour un autre joueur.</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
            Annuler
          </button>
          <button type="button" onClick={onConfirm} className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600">
            Quitter le match
          </button>
        </div>
      </div>
    </Modal>
  );
}
