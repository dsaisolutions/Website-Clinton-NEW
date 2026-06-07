ALTER TABLE calendar_events
  ADD COLUMN IF NOT EXISTS series_id uuid,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS calendar_events_series_id_idx ON calendar_events (series_id)
  WHERE series_id IS NOT NULL;
