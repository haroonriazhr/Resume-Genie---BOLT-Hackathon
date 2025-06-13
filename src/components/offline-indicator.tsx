import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePWAStatus } from '@/hooks/use-pwa';

export default function OfflineIndicator() {
  const { isOnline } = usePWAStatus();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (isOnline) {
      // Hide the alert immediately when online
      setShowAlert(false);
    } else {
      // Show the alert after a short delay when offline
      const timer = setTimeout(() => setShowAlert(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (showAlert) {
    return (
      <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
        <Alert className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="text-sm">
            You're currently offline. Some features may be limited.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
}