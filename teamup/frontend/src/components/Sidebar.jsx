import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useSocial } from '../context/SocialContext';
import InviteFriendsCard from './InviteFriendsCard';
import InviteFriendsModal from './InviteFriendsModal';
import {
  Bell, CalendarDays, CalendarPlus, DoorOpen, Gear, Home, Logout,
  MessageCircle, Search, User,
} from './landing/icons';

const navItems = [
  ['Tableau de bord', '/dashboard', Home], ['Trouver un match', '/matches', Search],
  ['Mes matchs', '/my-matches', CalendarDays], ['Créer un match', '/matches/create', CalendarPlus],
  ['Notifications', '/notifications', Bell], ['Messages', '/messages', MessageCircle],
  ['Profil', '/profile', User], ['Paramètres', '/settings', Gear],
];

function SidebarContent({ onNavigate, onLogout }) {
  const { unreadCount } = useNotifications();
  const { unreadMessagesCount } = useSocial();
  return (
    <div className="px-4 py-6 text-white">
      <NavLink to="/dashboard" onClick={onNavigate} className="mb-10 flex items-center gap-3">
        <img src="/img/logo-teamup.png" alt="TeamUp" className="h-12 w-12 rounded-full object-cover" />
        <span className="truncate text-2xl font-black italic">Team<span className="text-orange-500">Up</span></span>
      </NavLink>
      <nav className="grid gap-2" aria-label="Navigation du dashboard">
        {navItems.map(([label, path, Icon, badge]) => (
          <NavLink key={label} to={path} onClick={onNavigate} className={({ isActive }) => `teamup-sidebar-link flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition ${isActive ? 'bg-lime-700 text-white shadow-lg shadow-lime-900/20' : 'text-white/90 hover:bg-white/10'}`}>
            <Icon size={19} color="currentColor" className="w-5 shrink-0" />
            <span className="min-w-0 flex-1 break-words leading-5">{label}</span>
            {label === 'Notifications' && unreadCount > 0 ? <span className="grid h-7 w-7 place-items-center rounded-full bg-lime-600 text-sm font-black">{unreadCount}</span> : null}
            {label === 'Messages' && unreadMessagesCount > 0 ? <span className="grid h-7 w-7 place-items-center rounded-full bg-lime-600 text-sm font-black">{unreadMessagesCount}</span> : null}
          </NavLink>
        ))}
        <div className="my-5 h-px bg-white/10" />
        <button type="button" onClick={onLogout} className="teamup-sidebar-link flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold text-white/90 transition hover:bg-red-500/10 hover:text-red-200">
          <Logout size={19} color="currentColor" className="w-5 shrink-0" /> Déconnexion
        </button>
      </nav>
    </div>
  );
}

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);
  const requestLogout = () => { closeMobile(); setConfirmOpen(true); };
  const confirmLogout = () => { logout(); setConfirmOpen(false); navigate('/'); };

  return (
    <>
      <button type="button" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu du dashboard" aria-expanded={mobileOpen} className="fixed left-4 top-4 z-[80] inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#071417] text-white shadow-lg lg:hidden">
        <Menu size={24} />
      </button>
      {mobileOpen && <button type="button" aria-label="Fermer le menu" onClick={closeMobile} className="fixed inset-0 z-[60] bg-slate-950/55 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-[280px] overflow-y-auto bg-[#071417] transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button type="button" onClick={closeMobile} aria-label="Fermer le menu du dashboard" className="absolute right-3 top-3 z-10 rounded-lg p-2 text-white/80 hover:bg-white/10"><X size={22} /></button>
        <SidebarContent onNavigate={closeMobile} onLogout={requestLogout} />
        <div className="px-4 pb-6"><InviteFriendsCard onInvite={() => { closeMobile(); setInviteOpen(true); }} /></div>
      </aside>
      <aside className="teamup-sidebar hidden min-h-screen w-[300px] shrink-0 overflow-y-auto overflow-x-hidden bg-[#071417] text-white lg:block">
        <SidebarContent onLogout={requestLogout} />
        <div className="px-4 pb-6"><InviteFriendsCard onInvite={() => setInviteOpen(true)} /></div>
      </aside>
      <InviteFriendsModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} />
      {confirmOpen && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xl"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-orange-50 text-orange-600"><DoorOpen size={48} /></div><h2 className="mt-6 text-2xl font-black text-slate-950">Déconnexion</h2><p className="mt-3 text-sm leading-6 text-slate-500">Tu es sur le point de te déconnecter.<br />À bientôt sur TeamUp !</p><div className="mt-7 grid gap-3 sm:grid-cols-2"><button onClick={() => setConfirmOpen(false)} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Annuler</button><button onClick={confirmLogout} className="rounded-lg bg-orange-600 px-5 py-3 text-sm font-black text-white hover:bg-orange-700">Se déconnecter</button></div></div></div>}
    </>
  );
}
