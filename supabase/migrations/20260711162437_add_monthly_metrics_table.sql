/*
# Add monthly_metrics table for ARR growth chart

1. New Tables
- `monthly_metrics`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users)
  - `month` (text, not null) — e.g. 'Jan', 'Feb'
  - `arr` (numeric, default 0) — annual recurring revenue
  - `target` (numeric, default 0) — board-level target
  - `sort_order` (integer, default 0) — for chronological ordering
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `monthly_metrics`.
- Owner-scoped CRUD: each authenticated user can only access their own rows.

3. Important Notes
- Replaces the hardcoded `mockGrowthData` array in Dashboard.tsx.
- The dashboard queries this table for real ARR growth chart data.
*/

CREATE TABLE IF NOT EXISTS monthly_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  month text NOT NULL,
  arr numeric NOT NULL DEFAULT 0,
  target numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE monthly_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_monthly_metrics" ON monthly_metrics;
CREATE POLICY "select_own_monthly_metrics" ON monthly_metrics FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_monthly_metrics" ON monthly_metrics;
CREATE POLICY "insert_own_monthly_metrics" ON monthly_metrics
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_monthly_metrics" ON monthly_metrics;
CREATE POLICY "update_own_monthly_metrics" ON monthly_metrics
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_monthly_metrics" ON monthly_metrics;
CREATE POLICY "delete_own_monthly_metrics" ON monthly_metrics
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_monthly_metrics_user_sort ON monthly_metrics(user_id, sort_order);
