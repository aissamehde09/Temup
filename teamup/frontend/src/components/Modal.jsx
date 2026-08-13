export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-6" role="presentation">
      <section
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
        role="dialog"
      >
        <div className="flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Fermer la fenêtre" className="rounded-full px-3 py-1 text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </div>
  );
}
