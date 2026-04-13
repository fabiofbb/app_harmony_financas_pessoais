'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteTransaction } from '@/lib/actions/transactions';
import { Category, Transaction } from '@/lib/types';
import { formatBRL } from '@/lib/utils/currency';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TransactionForm } from './TransactionForm';
import { ExportCSVButton } from './ExportCSVButton';

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  month?: number;
  year?: number;
}

export function TransactionTable({
  transactions,
  categories,
  month,
  year,
}: TransactionTableProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (t: Transaction) => {
    setEditing(t);
    setFormOpen(true);
  };

  const handleNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const result = await deleteTransaction(deleteId);
    if (result.success) {
      toast.success('Transação excluída!');
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setDeleting(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <p className="text-sm text-muted-foreground">
          {transactions.length} transação{transactions.length !== 1 ? 'ões' : ''} encontrada{transactions.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <ExportCSVButton transactions={transactions} month={month} year={year} />
          <Button size="sm" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="hidden sm:table-cell">Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Nenhuma transação encontrada. Clique em &quot;Nova Transação&quot; para começar.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {format(new Date(t.date + 'T00:00:00'), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm truncate max-w-[200px]">
                      {t.description}
                    </p>
                    <p className="text-xs text-muted-foreground sm:hidden">
                      {t.category?.name}
                    </p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {t.category?.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={t.type === 'revenue' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {t.type === 'revenue' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-sm whitespace-nowrap">
                    <span className={t.type === 'revenue' ? 'text-green-600' : 'text-red-600'}>
                      {t.type === 'revenue' ? '+' : '-'}{formatBRL(Number(t.value))}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEdit(t)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(t.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        categories={categories}
        transaction={editing}
      />

      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir transação?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. A transação será excluída permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
