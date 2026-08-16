import { Heart } from './landing/icons';

export default function FavoriteButton({ active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex items-center justify-center gap-3 rounded-lg border border-orange-500 bg-white px-6 py-4 text-sm font-black text-orange-600 hover:bg-orange-50"
    >
      <Heart size={15} color="currentColor" />
      {active ? 'Ajouté aux favoris' : 'Ajouter aux favoris'}
    </button>
  );
}
