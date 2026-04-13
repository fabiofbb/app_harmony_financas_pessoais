export type TransactionType = 'revenue' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType | 'both';
}

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  value: number;
  date: string;
  type: TransactionType;
  category_id: string;
  category: Category;
  created_at: string;
  updated_at: string;
}

export interface TransactionInput {
  description: string;
  value: number;
  date: string;
  type: TransactionType;
  category_id: string;
}

export interface TransactionFilters {
  month?: number;
  year?: number;
  category_id?: string;
  search?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  balance: number;
  categoryBreakdown: Array<{
    category: string;
    value: number;
    color: string;
  }>;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
