'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListIcon, LogOut, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/transactions', label: 'Transações', icon: ListIcon },
];

interface SidebarProps {
  userEmail?: string;
}

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r bg-card">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Harmony</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Finanças Pessoais</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              pathname === href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground mb-3 truncate">{userEmail}</p>
        <form action={logoutAction}>
          <Button variant="outline" size="sm" className="w-full" type="submit">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </form>
      </div>
    </aside>
  );
}
