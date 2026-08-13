import { List, Map } from '../components/landing/icons';

export default function ViewToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Mode d’affichage">
      {[
        { id: 'list', label: 'Liste', Icon: List },
        { id: 'map', label: 'Carte', Icon: Map },
      ].map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-black transition ${
            value === id
              ? 'border-lime-800 bg-lime-800 text-white shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-lime-700 hover:text-lime-800'
          }`}
        >
          <Icon size={16} color="currentColor" />
          {label}
        </button>
      ))}
    </div>
  );
}
