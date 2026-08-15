import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    level: 'Débutant',
    sports: [1],
  });

  function toggleSport(id) {
    const exists = form.sports.includes(id);
    setForm({ ...form, sports: exists ? form.sports.filter((sportId) => sportId !== id) : [...form.sports, id] });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (form.sports.length === 0) {
      setError('Sélectionne au moins un sport.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-slate-50 px-6 py-12">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black">Créer un compte</h1>
        <p className="mt-2 text-slate-500">Complète ton profil sportif pour rejoindre la communauté TeamUp.</p>
        {error && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="Prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          <Input label="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
          <Input label="Mot de passe" type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="Confirmation mot de passe" type="password" minLength={8} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Niveau
            <select className="rounded-2xl border border-slate-200 px-4 py-3" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              <option>Débutant</option>
              <option>Intermédiaire</option>
              <option>Confirmé</option>
            </select>
          </label>
          <div className="grid gap-2 text-sm font-medium text-slate-700">
            Sports pratiqués
            <div className="flex gap-3">
              {[[1, 'Basketball'], [2, 'Football']].map(([id, label]) => (
                <button type="button" key={id} onClick={() => toggleSport(id)} className={`rounded-xl px-4 py-3 font-semibold transition-colors ${form.sports.includes(id) ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button className="mt-8" disabled={loading}>{loading ? 'Création...' : 'Créer mon compte'}</Button>
      </form>
    </main>
  );
}
