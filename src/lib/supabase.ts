import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anonKey);

export type EventType = 'bjj' | 'mma' | 'wrestling' | 'kids' | 'open-mat' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: EventType;
  audience: string;
  class_level: string;
  start_time: string;
  end_time: string;
  location: string | null;
  is_cancelled: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
