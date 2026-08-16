import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import PublicLayout from './layouts/PublicLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';
import SEO from './components/SEO';

const LandingPage = lazy(() => import('./components/landing/LandingPage'));
const EditMatchPage = lazy(() => import('./pages/EditMatchPage'));
const CreateMatchPage = lazy(() => import('./pages/CreateMatchPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const MatchDetailPage = lazy(() => import('./pages/MatchDetailPage'));
const MyMatchesPage = lazy(() => import('./pages/MyMatchesPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const MatchesPage = lazy(() => import('./pages/MatchesPage'));
const InfoPage = lazy(() => import('./pages/InfoPage'));
const PlayerProfilePage = lazy(() => import('./pages/PlayerProfilePage'));

export default function App() {
  return (
    <>
      <SEO />
      <ErrorBoundary>
        <Suspense
          fallback={
            <main className="min-h-screen bg-slate-50 p-6">
              <Loader label="Chargement de TeamUp..." />
            </main>
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route element={<PublicLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/faq" element={<InfoPage />} />
              <Route path="/contact" element={<InfoPage />} />
              <Route path="/terms" element={<InfoPage />} />
              <Route path="/legal" element={<InfoPage />} />
              <Route path="/cgu" element={<InfoPage />} />
              <Route path="/cookies" element={<InfoPage />} />
            </Route>

            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/matches/:id" element={<MatchDetailPage />} />
              <Route path="/matches/create" element={<CreateMatchPage />} />
              <Route path="/matches/:id/edit" element={<EditMatchPage />} />
              <Route path="/my-matches" element={<MyMatchesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/players/:id" element={<PlayerProfilePage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

function NotFoundPage() {
  return (
    <main className="grid min-h-[calc(100vh-74px)] place-items-center bg-slate-50 p-6 text-center">
      <div>
        <p className="text-7xl font-black text-slate-200">404</p>
        <h1 className="mt-4 text-2xl font-black text-slate-950">Page introuvable</h1>
        <p className="mt-2 text-sm text-slate-500">La page que tu cherches n'existe pas ou a été déplacée.</p>
        <a href="/dashboard" className="mt-6 inline-flex rounded-lg bg-lime-700 px-6 py-3 text-sm font-black text-white hover:bg-lime-800">
          Retour au tableau de bord
        </a>
      </div>
    </main>
  );
}
