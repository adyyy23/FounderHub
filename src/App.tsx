import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Loader as Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const AIAdvisor = lazy(() => import('@/pages/AIAdvisor'));
const Investors = lazy(() => import('@/pages/Investors'));
const AddInvestor = lazy(() => import('@/pages/AddInvestor'));
const InvestorProfile = lazy(() => import('@/pages/InvestorProfile'));
const IdeaVault = lazy(() => import('@/pages/IdeaVault'));
const Goals = lazy(() => import('@/pages/Goals'));
const Metrics = lazy(() => import('@/pages/Metrics'));
const Roadmap = lazy(() => import('@/pages/Roadmap'));
const Team = lazy(() => import('@/pages/Team'));
const Settings = lazy(() => import('@/pages/Settings'));
const SearchResults = lazy(() => import('@/pages/SearchResults'));
const GoalArchive = lazy(() => import('@/pages/GoalArchive'));
const IdeaSpec = lazy(() => import('@/pages/IdeaSpec'));
const TeamBacklog = lazy(() => import('@/pages/TeamBacklog'));

import './App.css';

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-xl">F</span>
        </div>
        <Loader2 size={24} className="text-orange-500 animate-spin" />
      </div>
    </div>
  );
}

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/advisor" element={<AIAdvisor />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/investors/new" element={<AddInvestor />} />
            <Route path="/investors/:id/edit" element={<AddInvestor />} />
            <Route path="/investors/:id" element={<InvestorProfile />} />
            <Route path="/ideas" element={<IdeaVault />} />
            <Route path="/ideas/:id" element={<IdeaSpec />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/goals/archive" element={<GoalArchive />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team/backlog" element={<TeamBacklog />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}
