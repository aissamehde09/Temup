import { EmptyBox } from './landing/icons';

export default function EmptyState({ title = 'Aucun résultat', description = 'Aucune donnée à afficher pour le moment.' }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
        <EmptyBox size={22} color="currentColor" />
      </div>
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
