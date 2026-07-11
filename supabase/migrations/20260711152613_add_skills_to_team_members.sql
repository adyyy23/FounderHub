-- Add skills column to team_members for tracking member skills
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}';
