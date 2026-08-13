import Button from './Button';
import Input from './Input';

export default function SearchFilters({ filters, onChange, onSubmit }) {
  function update(name, value) {
    onChange({ ...filters, [name]: value });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:grid-cols-6">
      <Input label="Recherche" value={filters.search || ''} onChange={(e) => update('search', e.target.value)} placeholder="Match, lieu..." />
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Sport
        <select className="rounded-2xl border border-slate-200 px-4 py-3" value={filters.sport || ''} onChange={(e) => update('sport', e.target.value)}>
          <option value="">Tous</option>
          <option value="basketball">Basketball</option>
          <option value="football">Football</option>
        </select>
      </label>
      <Input label="Ville" value={filters.city || ''} onChange={(e) => update('city', e.target.value)} placeholder="Nanterre" />
      <Input label="Date" type="date" value={filters.date || ''} onChange={(e) => update('date', e.target.value)} />
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Niveau
        <select className="rounded-2xl border border-slate-200 px-4 py-3" value={filters.level || ''} onChange={(e) => update('level', e.target.value)}>
          <option value="">Tous</option>
          <option>Débutant</option>
          <option>Intermédiaire</option>
          <option>Confirmé</option>
        </select>
      </label>
      <Button className="self-end">Filtrer</Button>
    </form>
  );
}

