import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PagePanel, SelectInput } from '../components/InternalUI';
import { Bell, Lock, Pen, ShieldCheck, User } from '../components/landing/icons';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const settingsNav = [['Compte', User], ['Profil', User], ['Sécurité', Lock], ['Notifications', Bell], ['Confidentialité', ShieldCheck]];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [active, setActive] = useState('Compte');
  const [language, setLanguage] = useState('Français');
  const [timezone, setTimezone] = useState('(GMT+01:00) Paris');
  const [message, setMessage] = useState('');

  function edit(label) {
    if (label === 'Email') setMessage('La modification de l’adresse email sera disponible prochainement.');
    if (label === 'Mot de passe') setMessage('La modification du mot de passe sera disponible prochainement.');
  }

  function removeAccount() {
    if (!window.confirm('Supprimer définitivement ton compte ?')) return;
    logout();
    navigate('/');
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <PagePanel className="grid gap-8 p-7 md:grid-cols-[270px_1fr]">
        <aside className="grid content-start gap-2">
          {settingsNav.map(([label, Icon]) => (
            <button key={label} type="button" onClick={() => setActive(label)} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-bold transition ${active === label ? 'bg-lime-50 text-lime-900' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icon size={15} color="currentColor" />{label}
              {label === 'Notifications' && unreadCount > 0 && <span className="ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">{unreadCount}</span>}
            </button>
          ))}
        </aside>

        <section className="grid gap-6">
          {active === 'Compte' && <>
            <SettingRow label="Email" value={user?.email || '—'} onEdit={() => edit('Email')} />
            <SettingRow label="Mot de passe" value="••••••••••••••••••" onEdit={() => edit('Mot de passe')} />
            <div><label className="text-sm font-black text-slate-700">Langue</label><SelectInput className="mt-2 w-full" value={language} onChange={(e) => setLanguage(e.target.value)}><option>Français</option><option>Anglais</option></SelectInput></div>
            <div><label className="text-sm font-black text-slate-700">Fuseau horaire</label><SelectInput className="mt-2 w-full" value={timezone} onChange={(e) => setTimezone(e.target.value)}><option>(GMT+01:00) Paris</option><option>(GMT+00:00) Casablanca</option></SelectInput></div>
          </>}
          {active === 'Profil' && <Info title="Profil" text="Gère ta photo, ton nom, ta ville et ton niveau depuis la page Profil." action="Modifier mon profil" onClick={() => navigate('/profile')} />}
          {active === 'Sécurité' && <Info title="Sécurité" text="Ton compte est protégé par un mot de passe chiffré et une session JWT." action="Modifier le mot de passe" onClick={() => edit('Mot de passe')} />}
          {active === 'Notifications' && <Info title="Notifications" text={`Tu as ${unreadCount} notification(s) non lue(s).`} action="Voir mes notifications" onClick={() => navigate('/notifications')} />}
          {active === 'Confidentialité' && <Info title="Confidentialité" text="Tes informations de profil sont visibles uniquement dans le cadre de TeamUp." />}
          {message && <p className="rounded-lg bg-lime-50 p-4 text-sm font-semibold text-lime-800">{message}</p>}
          <button type="button" onClick={removeAccount} className="mt-3 h-12 rounded-lg border border-red-500 bg-white text-sm font-black text-red-600 hover:bg-red-50">Supprimer mon compte</button>
        </section>
      </PagePanel>
    </div>
  );
}

function SettingRow({ label, value, onEdit }) {
  return <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-slate-100 pb-5"><div><p className="text-sm font-black text-slate-700">{label}</p><p className="mt-2 text-sm font-medium text-slate-950">{value}</p></div><button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><Pen size={12} color="currentColor" />Modifier</button></div>;
}

function Info({ title, text, action, onClick }) {
  return <div className="rounded-xl border border-slate-100 bg-slate-50 p-6"><h2 className="text-xl font-black text-slate-950">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>{action && <button type="button" onClick={onClick} className="mt-5 rounded-lg bg-lime-700 px-5 py-3 text-sm font-black text-white hover:bg-lime-800">{action}</button>}</div>;
}
