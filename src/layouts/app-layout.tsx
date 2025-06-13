import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/app-header';
import AppSidebar from '@/components/app-sidebar';
import { useTheme } from '@/components/theme-provider';

export default function AppLayout() {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-col ml-0 lg:ml-64">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}