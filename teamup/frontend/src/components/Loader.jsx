export default function Loader({ label = 'Chargement...' }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-3xl bg-white p-8 text-slate-600 shadow-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      {label}
    </div>
  );
}

