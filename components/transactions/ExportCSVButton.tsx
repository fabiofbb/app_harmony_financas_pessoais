'use client';

import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { transactionsToCSV, downloadCSV } from '@/lib/utils/csv';
import { Transaction } from '@/lib/types';

interface ExportCSVButtonProps {
  transactions: Transaction[];
  month?: number;
  year?: number;
}

export function ExportCSVButton({ transactions, month, year }: ExportCSVButtonProps) {
  const handleExport = () => {
    const csv = transactionsToCSV(transactions);
    const now = new Date();
    const m = month ?? now.getMonth() + 1;
    const y = year ?? now.getFullYear();
    const filename = `harmony-financas-${y}-${String(m).padStart(2, '0')}.csv`;
    downloadCSV(csv, filename);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={transactions.length === 0}>
      <Download className="h-4 w-4 mr-2" />
      Exportar CSV
    </Button>
  );
}
