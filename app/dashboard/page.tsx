import { Suspense } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { getDashboardStats, getTransactions } from '@/lib/actions/transactions';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { ExpensePieChart } from '@/components/dashboard/ExpensePieChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { Skeleton } from '@/components/ui/skeleton';

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.month) || now.getMonth() + 1;
  const year = Number(params.year) || now.getFullYear();

  const [stats, recentTransactions] = await Promise.all([
    getDashboardStats(month, year),
    getTransactions({ month, year }),
  ]);

  const recent = recentTransactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Visão geral das suas finanças
          </p>
        </div>
        <Suspense>
          <MonthSelector month={month} year={year} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Total de Receitas"
          value={stats.totalRevenue}
          icon={TrendingUp}
          colorClass="text-green-600"
          bgClass="bg-green-100"
        />
        <SummaryCard
          title="Total de Despesas"
          value={stats.totalExpenses}
          icon={TrendingDown}
          colorClass="text-red-600"
          bgClass="bg-red-100"
        />
        <SummaryCard
          title="Saldo"
          value={stats.balance}
          icon={Wallet}
          colorClass={stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}
          bgClass={stats.balance >= 0 ? 'bg-blue-100' : 'bg-red-100'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart data={stats.categoryBreakdown} />
        <RecentTransactions transactions={recent} />
      </div>
    </div>
  );
}
