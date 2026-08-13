import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import PublicLayout from './layouts/PublicLayout';
import LandingPage from './components/landing/LandingPage';
import CreateMatchPage from './pages/CreateMatchPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import MatchDetailPage from './pages/MatchDetailPage';
import MyMatchesPage from './pages/MyMatchesPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import MessagesPage from './pages/MessagesPage';
import SettingsPage from './pages/SettingsPage';
import FavoritesPage from './pages/FavoritesPage';
import MatchesPage from './pages/MatchesPage';
import InfoPage from './pages/InfoPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import SEO from './components/SEO';

export default function App() {
  return (
    <>
      <SEO />
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
          <Route path="/my-matches" element={<MyMatchesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/players/:id" element={<PlayerProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}
