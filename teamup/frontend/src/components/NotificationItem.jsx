export default function NotificationItem({ notification, onRead }) {
  return (
    <button
      onClick={() => onRead?.(notification)}
      className="flex w-full items-start gap-3 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-100 transition hover:ring-emerald-200"
    >
      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${notification.read ? 'bg-slate-300' : 'bg-orange-400'}`} />
      <span>
        <span className="block text-sm font-semibold text-slate-950">{notification.type}</span>
        <span className="mt-1 block text-sm text-slate-600">{notification.message}</span>
      </span>
    </button>
  );
}

