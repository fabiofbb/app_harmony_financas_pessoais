import { Suspense } from 'react';
import { getCategories, getTransactions } from '@/lib/actions/transactions';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';

interface PageProps {
  searchParams: Promise<{
    month?: string;
    year?: string;
    category_id?: string;
    search?: string;
  }>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const now = new Date();

  const filters = {
    month: params.month ? Number(params.month) : now.getMonth() + 1,
    year: params.year ? Number(params.year) : now.getFullYear(),
    category_id: params.category_id,
    search: params.search,
  };

  const [transactions, categories] = await Promise.all([
    getTransactions(filters),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transações</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie suas receitas e despesas
        </p>
      </div>

      <Suspense>
        <TransactionFilters categories={categories} />
      </Suspense>

      <TransactionTable
        transactions={transactions}
        categories={categories}
        month={filters.month}
        year={filters.year}
      />
    </div>
  );
}
