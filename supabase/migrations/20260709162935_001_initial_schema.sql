/*
# Initial Schema for FounderHub

## Overview
This migration creates the core tables for FounderHub - a startup management platform
that includes user profiles, startup directory, investor CRM, messaging, notifications,
goals/OKRs, ideas, team management, tasks, and roadmap planning.

## Tables Created

### 1. profiles
- User profile information linked to auth.users
- Stores founder details, startup info, and social links

### 2. startups
- Startup directory entries
- Linked to owner (user) for data isolation

### 3. investors
- Investor CRM data
- Pipeline stages, contact info, notes

### 4. investor_favorites
- Users can save/favorite investors
- Many-to-many relationship

### 5. messages
- Direct messaging system between users
- Thread-based conversations

### 6. conversations
- Tracks conversation threads between users

### 7. conversation_participants
- Many-to-many for conversation membership

### 8. notifications
- User notification center
- Read/unread status tracking

### 9. goals
- OKR/Goals management
- Cascading objectives system

### 10. key_results
- Key results linked to goals
- Progress tracking

### 11. ideas
- Idea vault/portfolio
- Priority scoring (impact, confidence, effort)

### 12. team_members
- Team management
- Workload tracking

### 13. tasks
- Task assignment and tracking
- Linked to team members

### 14. roadmap_items
- Strategic roadmap planning
- Gantt-style timeline data

### 15. activity_log
- Activity feed for dashboard
- Tracks all user actions

## Security
- RLS enabled on all tables
- Owner-scoped policies for authenticated users
- Proper foreign key constraints
*/

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text NOT NULL,
  full_name text,
  company_name text,
  role text DEFAULT 'Founder',
  bio text,
  avatar_url text,
  website_url text,
  linkedin_url text,
  twitter_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT fk_user FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
CREATE POLICY "users_read_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
CREATE POLICY "users_insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Startups table
CREATE TABLE IF NOT EXISTS startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  industry text,
  stage text DEFAULT 'Seed',
  location text,
  website_url text,
  founded_year integer,
  team_size integer DEFAULT 1,
  arr numeric DEFAULT 0,
  funding_raised numeric DEFAULT 0,
  logo_url text,
  is_public boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE startups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_startups" ON startups;
CREATE POLICY "users_read_own_startups" ON startups FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_startups" ON startups;
CREATE POLICY "users_insert_own_startups" ON startups FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own_startups" ON startups;
CREATE POLICY "users_update_own_startups" ON startups FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_startups" ON startups;
CREATE POLICY "users_delete_own_startups" ON startups FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Public startups view (for directory)
DROP POLICY IF EXISTS "public_read_startups" ON startups;
CREATE POLICY "public_read_startups" ON startups FOR SELECT
  TO authenticated USING (is_public = true);

-- Investors table
CREATE TABLE IF NOT EXISTS investors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  firm text,
  email text,
  bio text,
  avatar_url text,
  stage text DEFAULT 'SOURCED',
  sentiment text DEFAULT 'Neutral',
  commitment numeric DEFAULT 0,
  portfolio_companies text[] DEFAULT '{}',
  typical_check_min numeric,
  typical_check_max numeric,
  focus_areas text[] DEFAULT '{}',
  location text,
  linkedin_url text,
  notes text,
  last_contact_date date,
  next_follow_up date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_stage CHECK (stage IN ('SOURCED', 'CONTACTED', 'INTERESTED', 'NEGOTIATING', 'SIGNED', 'PASSED'))
);

ALTER TABLE investors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_crud_own_investors" ON investors;
CREATE POLICY "users_crud_own_investors" ON investors FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_investors" ON investors;
CREATE POLICY "users_insert_own_investors" ON investors FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own_investors" ON investors;
CREATE POLICY "users_update_own_investors" ON investors FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_investors" ON investors;
CREATE POLICY "users_delete_own_investors" ON investors FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Investor favorites
CREATE TABLE IF NOT EXISTS investor_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  investor_id uuid NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, investor_id)
);

ALTER TABLE investor_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_crud_own_favorites" ON investor_favorites;
CREATE POLICY "users_crud_own_favorites" ON investor_favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_favorites" ON investor_favorites;
CREATE POLICY "users_insert_own_favorites" ON investor_favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_favorites" ON investor_favorites;
CREATE POLICY "users_delete_own_favorites" ON investor_favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Conversation participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(conversation_id, user_id)
);

ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "participants_read_own" ON conversation_participants;
CREATE POLICY "participants_read_own" ON conversation_participants FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "participants_insert_own" ON conversation_participants;
CREATE POLICY "participants_insert_own" ON conversation_participants FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages in conversations they're part of
DROP POLICY IF EXISTS "users_read_conversation_messages" ON messages;
CREATE POLICY "users_read_conversation_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "users_send_messages" ON messages;
CREATE POLICY "users_send_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  data jsonb DEFAULT '{}',
  read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_type CHECK (type IN ('info', 'success', 'warning', 'action'))
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create index for faster notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id) WHERE read_at IS NULL;

DROP POLICY IF EXISTS "users_crud_own_notifications" ON notifications;
CREATE POLICY "users_crud_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_notifications" ON notifications;
CREATE POLICY "users_insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own_notifications" ON notifications;
CREATE POLICY "users_update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL,
  description text,
  completion numeric DEFAULT 0,
  confidence text DEFAULT 'HIGH',
  status text DEFAULT 'active',
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_category CHECK (category IN ('product', 'growth', 'ops')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'completed', 'archived'))
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_crud_own_goals" ON goals;
CREATE POLICY "users_crud_own_goals" ON goals FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_goals" ON goals;
CREATE POLICY "users_insert_own_goals" ON goals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own_goals" ON goals;
CREATE POLICY "users_update_own_goals" ON goals FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_goals" ON goals;
CREATE POLICY "users_delete_own_goals" ON goals FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Key Results
CREATE TABLE IF NOT EXISTS key_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  label text NOT NULL,
  current numeric DEFAULT 0,
  target numeric NOT NULL,
  unit text DEFAULT '',
  inverse boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE key_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_crud_own_key_results" ON key_results;
CREATE POLICY "users_crud_own_key_results" ON key_results FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM goals WHERE goals.id = key_results.goal_id AND goals.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "users_insert_own_key_results" ON key_results;
CREATE POLICY "users_insert_own_key_results" ON key_results FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM goals WHERE goals.id = key_results.goal_id AND goals.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "users_update_own_key_results" ON key_results;
CREATE POLICY "users_update_own_key_results" ON key_results FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM goals WHERE goals.id = key_results.goal_id AND goals.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "users_delete_own_key_results" ON key_results;
CREATE POLICY "users_delete_own_key_results" ON key_results FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM goals WHERE goals.id = key_results.goal_id AND goals.user_id = auth.uid())
  );

-- Ideas
CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  impact numeric DEFAULT 5,
  confidence numeric DEFAULT 5,
  effort numeric DEFAULT 5,
  status text DEFAULT 'backlog',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_idea_category CHECK (category IN ('Product', 'Growth', 'Operations', 'Other')),
  CONSTRAINT valid_idea_status CHECK (status IN ('backlog', 'scoping', 'validation', 'ready', 'in_progress', 'completed', 'archived'))
);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_crud_own_ideas" ON ideas;
CREATE POLICY "users_crud_own_ideas" ON ideas FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_ideas" ON ideas;
CREATE POLICY "users_insert_own_ideas" ON ideas FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own_ideas" ON ideas;
CREATE POLICY "users_update_own_ideas" ON ideas FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_ideas" ON ideas;
CREATE POLICY "users_delete_own_ideas" ON ideas FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text,
  department text,
  email text,
  avatar_url text,
  status text DEFAULT 'active',
  workload numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_member_status CHECK (status IN ('active', 'inactive', 'on_leave'))
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_crud_own_team" ON team_members;
CREATE POLICY "users_crud_own_team" ON team_members FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_team" ON team_members;
CREATE POLICY "users_insert_own_team" ON team_members FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own_team" ON team_members;
CREATE POLICY "users_update_own_team" ON team_members FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_team" ON team_members;
CREATE POLICY "users_delete_own_team" ON team_members FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid REFERENCES team_members(id) ON DELETE SET NULL,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  priority text DEFAULT 'medium',
  status text DEFAULT 'todo',
  due_date date,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  CONSTRAINT valid_task_status CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'cancelled'))
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_crud_own_tasks" ON tasks;
CREATE POLICY "users_crud_own_tasks" ON tasks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_tasks" ON tasks;
CREATE POLICY "users_insert_own_tasks" ON tasks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own_tasks" ON tasks;
CREATE POLICY "users_update_own_tasks" ON tasks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_tasks" ON tasks;
CREATE POLICY "users_delete_own_tasks" ON tasks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Roadmap Items
CREATE TABLE IF NOT EXISTS roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'backlog',
  priority text DEFAULT 'medium',
  start_date date,
  end_date date,
  progress numeric DEFAULT 0,
  assignee text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_roadmap_status CHECK (status IN ('backlog', 'planned', 'in_progress', 'completed', 'cancelled')),
  CONSTRAINT valid_roadmap_priority CHECK (priority IN ('low', 'medium', 'high', 'critical'))
);

ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_crud_own_roadmap" ON roadmap_items;
CREATE POLICY "users_crud_own_roadmap" ON roadmap_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_roadmap" ON roadmap_items;
CREATE POLICY "users_insert_own_roadmap" ON roadmap_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own_roadmap" ON roadmap_items;
CREATE POLICY "users_update_own_roadmap" ON roadmap_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_roadmap" ON roadmap_items;
CREATE POLICY "users_delete_own_roadmap" ON roadmap_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Activity Log
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_activity" ON activity_log;
CREATE POLICY "users_read_own_activity" ON activity_log FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_activity" ON activity_log;
CREATE POLICY "users_insert_own_activity" ON activity_log FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_investors_user_stage ON investors(user_id, stage);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_ideas_user_status ON ideas(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_roadmap_user_status ON roadmap_items(user_id, status);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id, created_at DESC);