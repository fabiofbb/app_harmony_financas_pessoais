import { format } from 'date-fns';
import { Transaction } from '@/lib/types';

export function transactionsToCSV(transactions: Transaction[]): string {
  const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor (R$)'];
  const rows = transactions.map((t) => [
    format(new Date(t.date + 'T00:00:00'), 'dd/MM/yyyy'),
    t.description,
    t.category?.name ?? '',
    t.type === 'revenue' ? 'Receita' : 'Despesa',
    t.value.toFixed(2).replace('.', ','),
  ]);
  return [headers, ...rows].map((r) => r.join(';')).join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
