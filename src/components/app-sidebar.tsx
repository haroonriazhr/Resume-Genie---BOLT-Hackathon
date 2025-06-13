import { Link, useLocation } from 'react-router-dom';
import {
  Briefcase,
  LayoutDashboard,
  PanelTop,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, href, active, onClick }: SidebarItemProps) {
  return (
    <Link to={href} onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 mb-1",
          active && "bg-muted"
        )}
      >
        {icon}
        {label}
      </Button>
    </Link>
  );
}

interface AppSidebarProps {
  onNavigate?: () => void;
}

export default function AppSidebar({ onNavigate }: AppSidebarProps) {
  const { pathname } = useLocation();
  
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-background lg:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">ResumeGenie</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-6 px-4">
        <nav className="flex flex-col">
          <div className="mb-6">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Main
            </p>
            <SidebarItem
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Dashboard"
              href="/dashboard"
              active={pathname === '/dashboard'}
              onClick={onNavigate}
            />
            <SidebarItem
              icon={<PanelTop className="h-5 w-5" />}
              label="Templates"
              href="/templates"
              active={pathname === '/templates'}
              onClick={onNavigate}
            />
          </div>
          
          <div className="mb-6">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Account
            </p>
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              href="/settings"
              active={pathname === '/settings'}
              onClick={onNavigate}
            />
          </div>
        </nav>
      </div>
    </aside>
  );
}