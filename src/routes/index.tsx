import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import Dashboard from '@/pages/dashboard';
import Login from '@/pages/login';
import Register from '@/pages/register';
import ResumeBuilder from '@/pages/resume-builder';
import ResumeDetails from '@/pages/resume-details';
import ResumeTemplates from '@/pages/resume-templates';
import Settings from '@/pages/settings';
import LoadingScreen from '@/components/loading-screen';
import DownloadPage from '@/pages/download';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <AuthLayout />
            </GuestRoute>
          }
        >
          <Route index element={<Navigate to="/login\" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="templates" element={<ResumeTemplates />} />
          <Route path="builder" element={<ResumeBuilder />} />
          <Route path="resume/:id" element={<ResumeDetails />} />
          <Route path="settings" element={<Settings />} />
          <Route path="resume/download/:id" element={<DownloadPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}