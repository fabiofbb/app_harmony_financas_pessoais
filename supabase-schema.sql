-- =============================================
-- Harmony FinançasPessoais - Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Categories (reference table)
CREATE TABLE IF NOT EXISTS categories (
  id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('revenue', 'expense', 'both'))
);

-- Seed pre-defined categories
INSERT INTO categories (name, type) VALUES
  ('Alimentação',  'expense'),
  ('Transporte',   'expense'),
  ('Moradia',      'expense'),
  ('Lazer',        'expense'),
  ('Saúde',        'expense'),
  ('Educação',     'expense'),
  ('Salário',      'revenue'),
  ('Freelance',    'revenue'),
  ('Outros',       'both')
ON CONFLICT (name) DO NOTHING;

-- 2. Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description text          NOT NULL,
  value       numeric(12,2) NOT NULL CHECK (value > 0),
  date        date          NOT NULL,
  type        text          NOT NULL CHECK (type IN ('revenue', 'expense')),
  category_id uuid          NOT NULL REFERENCES categories(id),
  created_at  timestamptz   NOT NULL DEFAULT now(),
  updated_at  timestamptz   NOT NULL DEFAULT now()
);

-- Indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON transactions (user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_user_category
  ON transactions (user_id, category_id);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_transactions_updated_at ON transactions;
CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 3. Row Level Security
-- =============================================

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories   ENABLE ROW LEVEL SECURITY;

-- Categories: read-only for everyone (no auth required)
DROP POLICY IF EXISTS "categories_read_all" ON categories;
CREATE POLICY "categories_read_all"
  ON categories FOR SELECT
  USING (true);

-- Transactions: users own their rows
DROP POLICY IF EXISTS "transactions_select_own" ON transactions;
CREATE POLICY "transactions_select_own"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "transactions_insert_own" ON transactions;
CREATE POLICY "transactions_insert_own"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "transactions_update_own" ON transactions;
CREATE POLICY "transactions_update_own"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "transactions_delete_own" ON transactions;
CREATE POLICY "transactions_delete_own"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);
