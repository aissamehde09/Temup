export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label && <span className="leading-none">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-lime-600 focus:ring-4 focus:ring-lime-600/10 ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
