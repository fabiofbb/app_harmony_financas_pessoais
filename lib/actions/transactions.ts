'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResult, Category, DashboardStats, Transaction, TransactionFilters, TransactionInput } from '@/lib/types';
import { z } from 'zod';

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória').max(200),
  value: z.number().positive('Valor deve ser positivo'),
  date: z.string().regex(/\d{4}-\d{2}-\d{2}/, 'Data inválida'),
  type: z.enum(['revenue', 'expense']),
  category_id: z.string().uuid('Categoria inválida'),
});

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) return [];
  return data as Category[];
}

export async function getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters.month && filters.year) {
    const start = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`;
    const lastDay = new Date(filters.year, filters.month, 0).getDate();
    const end = `${filters.year}-${String(filters.month).padStart(2, '0')}-${lastDay}`;
    query = query.gte('date', start).lte('date', end);
  } else if (filters.year) {
    const start = `${filters.year}-01-01`;
    const end = `${filters.year}-12-31`;
    query = query.gte('date', start).lte('date', end);
  }

  if (filters.category_id) {
    query = query.eq('category_id', filters.category_id);
  }

  if (filters.search) {
    query = query.ilike('description', `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) return [];
  return data as Transaction[];
}

export async function getDashboardStats(
  month: number,
  year: number
): Promise<DashboardStats> {
  const transactions = await getTransactions({ month, year });

  const totalRevenue = transactions
    .filter((t) => t.type === 'revenue')
    .reduce((sum, t) => sum + Number(t.value), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.value), 0);

  const categoryMap = new Map<string, { name: string; value: number }>();
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const name = t.category?.name ?? 'Outros';
      const existing = categoryMap.get(name) ?? { name, value: 0 };
      categoryMap.set(name, { name, value: existing.value + Number(t.value) });
    });

  const colors = [
    '#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#f97316', '#84cc16', '#ec4899',
  ];

  const categoryBreakdown = Array.from(categoryMap.values()).map((item, i) => ({
    category: item.name,
    value: item.value,
    color: colors[i % colors.length],
  }));

  return {
    totalRevenue,
    totalExpenses,
    balance: totalRevenue - totalExpenses,
    categoryBreakdown,
  };
}

export async function createTransaction(
  data: TransactionInput
): Promise<ActionResult<Transaction>> {
  const parsed = transactionSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Não autenticado.' };

  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert({ ...parsed.data, user_id: user.id })
    .select('*, category:categories(*)')
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: transaction as Transaction };
}

export async function updateTransaction(
  id: string,
  data: TransactionInput
): Promise<ActionResult<Transaction>> {
  const parsed = transactionSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Não autenticado.' };

  const { data: transaction, error } = await supabase
    .from('transactions')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*, category:categories(*)')
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: transaction as Transaction };
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Não autenticado.' };

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };
  return { success: true, data: undefined };
}
