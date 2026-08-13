export default function StatCard({ label, value, icon }) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-xl">{icon}</span>
      </div>
      <p className="mt-5 text-3xl font-bold text-slate-950">{value}</p>
    </article>
  );
}

