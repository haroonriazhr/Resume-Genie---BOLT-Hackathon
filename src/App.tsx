import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import PWAInstallPrompt from '@/components/pwa-install-prompt';
import OfflineIndicator from '@/components/offline-indicator';
import AppRoutes from '@/routes';
import { Sentry } from '@/lib/sentry';
import ErrorFallback from '@/components/error-fallback';
import BoltButton from '@/components/bolt-button';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="resumegenie-theme">
      <AuthProvider>
        <AppRoutes />
        <BoltButton />
        <Toaster />
        <PWAInstallPrompt />
        <OfflineIndicator />
      </AuthProvider>
    </ThemeProvider>
  );
}

// Wrap the app with Sentry's error boundary to catch and report errors
const SentryApp = Sentry.withErrorBoundary(App, {
  fallback: <ErrorFallback />,
  showDialog: true,
});

export default SentryApp;