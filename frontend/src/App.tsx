import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Navbar from './components/layout/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import AssessmentResultPage from './pages/AssessmentResultPage';
import DashboardPage from './pages/DashboardPage';
import ActionsPage from './pages/ActionsPage';
import ChallengesPage from './pages/ChallengesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import TeamsPage from './pages/TeamsPage';
import AICoachPage from './pages/AICoachPage';
import EcoWorldPage from './pages/EcoWorldPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const noNavbar = ['/', '/auth', '/onboarding', '/assessment-result'].includes(location.pathname);
  return (
    <>
      {!noNavbar && <Navbar />}
      <main style={{ minHeight: '100vh' }} className="animated-bg">
        {children}
      </main>
    </>
  );
}

function AppRoutes() {
  const { isAuthenticated, fetchMe, token } = useAuthStore();

  useEffect(() => {
    if (token) fetchMe();
  }, [token]);

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        <Route path="/onboarding" element={
          <ProtectedRoute><OnboardingPage /></ProtectedRoute>
        } />
        <Route path="/assessment-result" element={
          <ProtectedRoute><AssessmentResultPage /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/actions" element={
          <ProtectedRoute><ActionsPage /></ProtectedRoute>
        } />
        <Route path="/challenges" element={
          <ProtectedRoute><ChallengesPage /></ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute><LeaderboardPage /></ProtectedRoute>
        } />
        <Route path="/teams" element={
          <ProtectedRoute><TeamsPage /></ProtectedRoute>
        } />
        <Route path="/coach" element={
          <ProtectedRoute><AICoachPage /></ProtectedRoute>
        } />
        <Route path="/ecoworld" element={
          <ProtectedRoute><EcoWorldPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(10,31,16,0.95)',
            color: '#f0fdf4',
            border: '1px solid rgba(34,197,94,0.25)',
            backdropFilter: 'blur(20px)',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#030f07' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#030f07' } },
        }}
      />
    </BrowserRouter>
  );
}
