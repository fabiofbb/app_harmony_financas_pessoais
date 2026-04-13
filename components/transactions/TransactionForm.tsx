'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { createTransaction, updateTransaction } from '@/lib/actions/transactions';
import { Category, Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const schema = z.object({
  description: z.string().min(1, 'Descrição obrigatória').max(200),
  value: z.string().min(1, 'Valor obrigatório'),
  date: z.string().min(1, 'Data obrigatória'),
  type: z.enum(['revenue', 'expense']),
  category_id: z.string().uuid('Selecione uma categoria'),
});

type FormData = z.infer<typeof schema>;

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  transaction?: Transaction | null;
}

export function TransactionForm({
  open,
  onClose,
  categories,
  transaction,
}: TransactionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit = !!transaction;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'expense',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (transaction) {
      reset({
        description: transaction.description,
        value: String(transaction.value),
        date: transaction.date,
        type: transaction.type,
        category_id: transaction.category_id,
      });
    } else {
      reset({
        description: '',
        value: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'expense',
        category_id: '',
      });
    }
  }, [transaction, reset]);

  const filteredCategories = categories.filter(
    (c) => c.type === selectedType || c.type === 'both'
  );

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const payload = {
      description: data.description,
      value: parseFloat(data.value.replace(',', '.')),
      date: data.date,
      type: data.type,
      category_id: data.category_id,
    };

    const result = isEdit
      ? await updateTransaction(transaction!.id, payload)
      : await createTransaction(payload);

    if (result.success) {
      toast.success(isEdit ? 'Transação atualizada!' : 'Transação criada!');
      router.refresh();
      onClose();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Transação' : 'Nova Transação'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['revenue', 'expense'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setValue('type', t);
                    setValue('category_id', '');
                  }}
                  className={`py-2 rounded-md text-sm font-medium border transition-colors ${
                    selectedType === t
                      ? t === 'revenue'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-red-600 text-white border-red-600'
                      : 'bg-background hover:bg-accent'
                  }`}
                >
                  {t === 'revenue' ? 'Receita' : 'Despesa'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Almoço no restaurante"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                placeholder="0,00"
                inputMode="decimal"
                {...register('value')}
              />
              {errors.value && (
                <p className="text-xs text-destructive">{errors.value.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={watch('category_id') ?? ''}
              onValueChange={(v) => setValue('category_id', v ?? '')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-xs text-destructive">{errors.category_id.message}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEdit ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
