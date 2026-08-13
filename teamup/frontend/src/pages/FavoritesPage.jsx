import { Link } from 'react-router-dom';
import { Heart } from '../components/landing/icons';

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <Heart size={48} color="#e11d48" />
      <h1 className="mt-4 text-3xl font-black text-slate-950">Aucun favori</h1>
      <p className="mt-2 text-slate-500">Les matchs ajoutés aux favoris apparaîtront ici.</p>
      <Link to="/matches/create" className="mt-6 inline-flex rounded-2xl bg-lime-600 px-5 py-3 text-sm font-black text-white">Créer un match</Link>
    </div>
  );
}
