/*
# Create calendar_events table

1. New Tables
  - `calendar_events`
    - `id` (uuid, primary key, auto-generated)
    - `title` (text, required) — name of the class or event
    - `description` (text) — optional longer description
    - `event_type` (text) — e.g. 'bjj', 'mma', 'wrestling', 'kids', 'open-mat', 'other'
    - `audience` (text) — e.g. 'adults', 'kids', 'all'
    - `class_level` (text) — e.g. 'all levels', 'beginner', 'advanced'
    - `start_time` (timestamptz, required) — when the event starts
    - `end_time` (timestamptz, required) — when the event ends
    - `location` (text) — room or mat area
    - `is_cancelled` (boolean, default false) — soft-cancel without deletion
    - `is_published` (boolean, default false) — only published events show publicly
    - `created_at` (timestamptz, auto) — row creation timestamp
    - `updated_at` (timestamptz, auto) — row update timestamp

2. Security
  - RLS enabled on `calendar_events`.
  - Public (anon) SELECT only for rows where is_published = true.
  - Authenticated users (admins) can SELECT, INSERT, UPDATE, DELETE all rows.

3. Notes
  - The public calendar only queries rows WHERE is_published = true — RLS enforces this at the DB level.
  - Admin credentials are managed through Supabase Auth (email/password). No service role key is exposed client-side.
  - An index on start_time supports efficient ascending sort for the public schedule.
*/

CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_type text NOT NULL DEFAULT 'other',
  audience text NOT NULL DEFAULT 'all',
  class_level text NOT NULL DEFAULT 'all levels',
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text,
  is_cancelled boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS calendar_events_start_time_idx ON calendar_events (start_time ASC);
CREATE INDEX IF NOT EXISTS calendar_events_published_idx ON calendar_events (is_published) WHERE is_published = true;

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Public read: anon key can only see published events
DROP POLICY IF EXISTS "public_select_published_events" ON calendar_events;
CREATE POLICY "public_select_published_events" ON calendar_events FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Authenticated (admin) full access
DROP POLICY IF EXISTS "admin_select_all_events" ON calendar_events;
CREATE POLICY "admin_select_all_events" ON calendar_events FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_events" ON calendar_events;
CREATE POLICY "admin_insert_events" ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_events" ON calendar_events;
CREATE POLICY "admin_update_events" ON calendar_events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_events" ON calendar_events;
CREATE POLICY "admin_delete_events" ON calendar_events FOR DELETE
  TO authenticated
  USING (true);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_calendar_events_updated_at ON calendar_events;
CREATE TRIGGER set_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_calendar_events_updated_at();
