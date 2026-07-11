/*
# Add notification_preferences table

1. New Tables
- `notification_preferences`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to authenticated user, references auth.users)
  - `email_notifications` (boolean, default true) — email notification opt-in
  - `product_updates` (boolean, default true) — product update notifications
  - `investor_alerts` (boolean, default true) — investor pipeline alerts
  - `team_notifications` (boolean, default true) — team activity notifications
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
2. Security
- Enable RLS on `notification_preferences`.
- Owner-scoped CRUD: each authenticated user can only access their own preferences.
3. Notes
- One row per user. Upsert pattern used in the service layer.
- If no preferences row exists for a user, the frontend should treat all notifications as enabled (defaults).
*/

CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications boolean NOT NULL DEFAULT true,
  product_updates boolean NOT NULL DEFAULT true,
  investor_alerts boolean NOT NULL DEFAULT true,
  team_notifications boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_preferences" ON notification_preferences;
CREATE POLICY "select_own_preferences"
ON notification_preferences FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_preferences" ON notification_preferences;
CREATE POLICY "insert_own_preferences"
ON notification_preferences FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_preferences" ON notification_preferences;
CREATE POLICY "update_own_preferences"
ON notification_preferences FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_preferences" ON notification_preferences;
CREATE POLICY "delete_own_preferences"
ON notification_preferences FOR DELETE
TO authenticated USING (auth.uid() = user_id);
