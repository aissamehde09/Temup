import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f8f4]">
        <Loader />
      </main>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />;

  return (
    <div className="teamup-app-shell flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="teamup-app-main min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:py-6">
        <Outlet />
      </main>
    </div>
  );
}
