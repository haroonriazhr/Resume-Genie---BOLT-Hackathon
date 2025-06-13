import { Outlet } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle';
import { Briefcase } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full py-4 px-6 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-foreground">ResumeGenie</span>
        </div>
        <ModeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>
      <footer className="py-4 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ResumeGenie. All rights reserved.
      </footer>
    </div>
  );
}