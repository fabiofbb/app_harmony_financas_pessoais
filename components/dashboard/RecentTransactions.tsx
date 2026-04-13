import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatBRL } from '@/lib/utils/currency';
import { Transaction } from '@/lib/types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Transações Recentes</CardTitle>
        <Link
          href="/dashboard/transactions"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1')}
        >
          Ver todas <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhuma transação registrada
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(t.date + 'T00:00:00'), "d 'de' MMM", { locale: ptBR })}
                    {' · '}
                    {t.category?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={t.type === 'revenue' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {t.type === 'revenue' ? 'Receita' : 'Despesa'}
                  </Badge>
                  <span
                    className={`text-sm font-semibold whitespace-nowrap ${
                      t.type === 'revenue' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {t.type === 'revenue' ? '+' : '-'}{formatBRL(Number(t.value))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
