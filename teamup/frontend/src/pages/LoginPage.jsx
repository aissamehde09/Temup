import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

const DEMO_CREDENTIALS = [
  { label: 'Mehdi (admin)', email: 'mehdi@teamup.local', password: 'password123' },
  { label: 'Alex', email: 'alex@teamup.local', password: 'password123' },
  { label: 'Sarah', email: 'sarah@teamup.local', password: 'password123' },
  { label: 'Thomas', email: 'thomas@teamup.local', password: 'password123' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || '/dashboard';
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin(credentials) {
    setForm(credentials);
    setError('');
  }

  return (
    <main className="login-page grid min-h-[calc(100vh-74px)] place-items-center overflow-x-hidden bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <form onSubmit={handleSubmit} className="login-card w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-sm sm:rounded-[2rem] sm:p-8">
        <h1 className="text-2xl font-black sm:text-3xl">Connexion</h1>
        <p className="mt-2 text-slate-500">Connecte-toi pour créer ou rejoindre un match.</p>
        {error && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        <div className="mt-6 grid gap-4">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Mot de passe" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button className="bg-[#65A30D] hover:bg-[#4d7c0f]" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</Button>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-4">
          <p className="text-xs font-medium text-slate-500">Comptes de démo (mot de passe: <code className="font-mono">password123</code>)</p>
          <div className="mt-2 grid gap-1.5">
            {DEMO_CREDENTIALS.map((creds) => (
              <button
                key={creds.email}
                type="button"
                onClick={() => handleDemoLogin({ email: creds.email, password: creds.password })}
                className="text-left rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                <span className="block font-medium text-slate-700">{creds.label}</span>
                <span className="text-xs text-slate-500">{creds.email}</span>
              </button>
            ))}
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-500">Pas encore de compte ? <Link className="font-semibold text-emerald-700" to="/register">S’inscrire</Link></p>
      </form>
    </main>
  );
}
