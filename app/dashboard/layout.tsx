import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { TrendingUp } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="flex min-h-screen">
      <Sidebar userEmail={user.email} />
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3">
            <MobileNav userEmail={user.email} />
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-bold">Harmony</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
