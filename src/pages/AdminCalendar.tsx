import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Eye, EyeOff, Ban, RotateCcw, LogOut,
  AlertCircle, X, ChevronDown, Pencil, RefreshCw,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CalendarEvent } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// ─── Display config ───────────────────────────────────────────────────────────

const EVENT_TYPE_OPTS = [
  { value: 'class',    label: 'Class'    },
  { value: 'workshop', label: 'Workshop' },
];

const AUDIENCE_OPTS = [
  { value: 'all',    label: 'All'    },
  { value: 'adults', label: 'Adults' },
  { value: 'kids',   label: 'Kids'   },
  { value: 'women',  label: 'Women'  },
];

const LEVEL_OPTS = [
  { value: 'all levels', label: 'All Levels' },
  { value: 'wrestling',  label: 'Wrestling'  },
  { value: 'gi',         label: 'Gi'         },
  { value: 'no gi',      label: 'No Gi'      },
  { value: 'mma',        label: 'MMA'        },
  { value: 'open mat',   label: 'Open Mat'   },
];

const DAYS_OF_WEEK = [
  { value: '0', label: 'Sunday'    },
  { value: '1', label: 'Monday'    },
  { value: '2', label: 'Tuesday'   },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday'  },
  { value: '5', label: 'Friday'    },
  { value: '6', label: 'Saturday'  },
];

const TYPE_COLOR: Record<string, string> = {
  class:      '#2563EB',
  workshop:   '#D97706',
  bjj:        '#2563EB',
  mma:        '#C41E1E',
  wrestling:  '#D97706',
  kids:       '#16A34A',
  'open-mat': '#F5C400',
  other:      '#6B7280',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function toDatetimeLocal(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputToISO(val: string): string {
  if (!val) return '';
  return new Date(val).toISOString();
}

function getLocalTimeParts(iso: string): { h: number; m: number } {
  const d = new Date(iso);
  return { h: d.getHours(), m: d.getMinutes() };
}

function replaceTime(originalIso: string, h: number, m: number): string {
  const d = new Date(originalIso);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

/**
 * Returns all dates between startDate and endDate (inclusive, YYYY-MM-DD strings)
 * that fall on the given dayOfWeek (0=Sun). Uses noon local time to avoid DST edge cases.
 */
function generateWeeklyDates(startDate: string, endDate: string, dayOfWeek: number): Date[] {
  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ey, em, ed] = endDate.split('-').map(Number);
  const start = new Date(sy, sm - 1, sd, 12);
  const end   = new Date(ey, em - 1, ed, 12);

  const diff = (dayOfWeek - start.getDay() + 7) % 7;
  const cur  = new Date(start);
  cur.setDate(cur.getDate() + diff);

  const result: Date[] = [];
  while (cur <= end) {
    result.push(new Date(cur));
    cur.setDate(cur.getDate() + 7);
  }
  return result;
}

/** Combine a Date's calendar date with a 'HH:MM' time string → UTC ISO string. */
function combineDateAndTime(date: Date, timeStr: string): string {
  const [hh, mm] = timeStr.split(':').map(Number);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hh, mm, 0, 0).toISOString();
}

// ─── Types ────────────────────────────────────────────────────────────────────

type EditScope = 'this' | 'future' | 'all';

interface FormState {
  title: string;
  description: string;
  event_type: string;
  audience: string;
  class_level: string;
  location: string;
  is_published: boolean;
  is_cancelled: boolean;
  // Single-event
  start_time: string;
  end_time: string;
  // Recurrence (create-only)
  repeat_type: 'none' | 'weekly';
  recur_start_date: string;
  recur_end_date: string;
  recur_day: string;
  recur_start_time: string;
  recur_end_time: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  event_type: 'class',
  audience: 'all',
  class_level: 'all levels',
  location: '',
  is_published: true,
  is_cancelled: false,
  start_time: '',
  end_time: '',
  repeat_type: 'none',
  recur_start_date: '',
  recur_end_date: '',
  recur_day: '1',
  recur_start_time: '',
  recur_end_time: '',
};

function toFormState(ev: CalendarEvent): FormState {
  return {
    ...EMPTY_FORM,
    title:        ev.title,
    description:  ev.description ?? '',
    event_type:   ev.event_type,
    audience:     ev.audience,
    class_level:  ev.class_level,
    location:     ev.location ?? '',
    is_published: ev.is_published,
    is_cancelled: ev.is_cancelled,
    start_time:   toDatetimeLocal(ev.start_time),
    end_time:     toDatetimeLocal(ev.end_time),
  };
}

// ─── EventModal ───────────────────────────────────────────────────────────────

function EventModal({
  editing,
  onClose,
  onSaved,
}: {
  editing: CalendarEvent | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm]           = useState<FormState>(editing ? toFormState(editing) : EMPTY_FORM);
  const [editScope, setEditScope] = useState<EditScope>('this');
  const [error, setError]         = useState('');
  const [saving, setSaving]       = useState(false);

  const set = (k: keyof FormState, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const hasSeries = Boolean(editing?.series_id);

  const validate = (): string => {
    if (!form.title.trim()) return 'Title is required.';
    if (editing || form.repeat_type === 'none') {
      if (!form.start_time) return 'Start time is required.';
      if (!form.end_time)   return 'End time is required.';
      if (new Date(form.start_time) >= new Date(form.end_time))
        return 'End time must be after start time.';
    } else {
      if (!form.recur_start_date) return 'Start date is required.';
      if (!form.recur_end_date)   return 'End date is required.';
      if (form.recur_end_date < form.recur_start_date)
        return 'End date cannot be before start date.';
      if (!form.recur_start_time) return 'Start time is required.';
      if (!form.recur_end_time)   return 'End time is required.';
      if (form.recur_start_time >= form.recur_end_time)
        return 'End time must be after start time.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setSaving(true);
    try {
      editing ? await handleEdit() : await handleCreate();
      onSaved();
    } catch (ex: unknown) {
      setError(ex instanceof Error ? ex.message : 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    const base = {
      title:       form.title.trim(),
      description: form.description.trim() || null,
      event_type:  form.event_type,
      audience:    form.audience,
      class_level: form.class_level,
      location:    form.location.trim() || null,
      is_published: form.is_published,
      is_cancelled: false,
    };

    if (form.repeat_type === 'none') {
      const { error } = await supabase.from('calendar_events').insert({
        ...base,
        start_time: localInputToISO(form.start_time),
        end_time:   localInputToISO(form.end_time),
        series_id:  null,
      });
      if (error) throw new Error(error.message);
    } else {
      const seriesId = crypto.randomUUID();
      const dates    = generateWeeklyDates(
        form.recur_start_date,
        form.recur_end_date,
        parseInt(form.recur_day, 10),
      );
      if (dates.length === 0)
        throw new Error('No matching dates found. Verify your start date, end date, and day of week.');

      const rows = dates.map(date => ({
        ...base,
        start_time: combineDateAndTime(date, form.recur_start_time),
        end_time:   combineDateAndTime(date, form.recur_end_time),
        series_id:  seriesId,
      }));

      const { error } = await supabase.from('calendar_events').insert(rows);
      if (error) throw new Error(error.message);
    }
  };

  const handleEdit = async () => {
    if (!editing) return;

    const basePayload: Record<string, unknown> = {
      title:        form.title.trim(),
      description:  form.description.trim() || null,
      event_type:   form.event_type,
      audience:     form.audience,
      class_level:  form.class_level,
      location:     form.location.trim() || null,
      is_published: form.is_published,
      is_cancelled: form.is_cancelled,
    };

    const newStartISO = localInputToISO(form.start_time);
    const newEndISO   = localInputToISO(form.end_time);

    // Single-event or "this event only"
    if (!hasSeries || editScope === 'this') {
      const { error } = await supabase
        .from('calendar_events')
        .update({ ...basePayload, start_time: newStartISO, end_time: newEndISO })
        .eq('id', editing.id);
      if (error) throw new Error(error.message);
      return;
    }

    // Series scope — check whether only the time-of-day changed
    const origStartParts = getLocalTimeParts(editing.start_time);
    const origEndParts   = getLocalTimeParts(editing.end_time);
    const newStartParts  = getLocalTimeParts(newStartISO);
    const newEndParts    = getLocalTimeParts(newEndISO);

    const timesChanged =
      origStartParts.h !== newStartParts.h || origStartParts.m !== newStartParts.m ||
      origEndParts.h   !== newEndParts.h   || origEndParts.m   !== newEndParts.m;

    if (!timesChanged) {
      // Non-time fields only — simple bulk update
      let query = supabase
        .from('calendar_events')
        .update(basePayload)
        .eq('series_id', editing.series_id!);
      if (editScope === 'future') query = query.gte('start_time', editing.start_time);
      const { error } = await query;
      if (error) throw new Error(error.message);
    } else {
      // Fetch affected rows, update each preserving original date + new time
      let q = supabase
        .from('calendar_events')
        .select('id, start_time, end_time')
        .eq('series_id', editing.series_id!);
      if (editScope === 'future') q = q.gte('start_time', editing.start_time);

      const { data, error: fetchErr } = await q;
      if (fetchErr) throw new Error(fetchErr.message);

      for (const row of (data ?? []) as { id: string; start_time: string; end_time: string }[]) {
        const updatedStart = replaceTime(row.start_time, newStartParts.h, newStartParts.m);
        const updatedEnd   = replaceTime(row.end_time,   newEndParts.h,   newEndParts.m);
        const { error } = await supabase
          .from('calendar_events')
          .update({ ...basePayload, start_time: updatedStart, end_time: updatedEnd })
          .eq('id', row.id);
        if (error) throw new Error(error.message);
      }
    }
  };

  const inputCls =
    'w-full bg-gym-black border border-gym-charcoal-light text-white font-body text-sm px-3 py-2.5 focus:outline-none focus:border-bee-yellow transition-colors placeholder-gray-700';
  const labelCls = 'font-heading text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5';
  const selCls   = `${inputCls} appearance-none`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      style={{ background: 'rgba(0,0,0,0.88)' }}
    >
      <div className="relative w-full max-w-xl bg-gym-charcoal border border-gym-charcoal-light overflow-y-auto max-h-[92vh]">
        <div className="h-1 bg-bee-yellow" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-gym-charcoal-light">
          <h2 className="font-display text-xl text-white uppercase">
            {editing ? 'Edit Event' : 'New Event'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input
              className={inputCls}
              required
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Adult Jiu Jitsu"
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Optional details..."
            />
          </div>

          {/* Event Type / Audience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Event Type *</label>
              <div className="relative">
                <select
                  className={`${selCls} pr-8`}
                  value={form.event_type}
                  onChange={e => set('event_type', e.target.value)}
                >
                  {EVENT_TYPE_OPTS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Audience</label>
              <div className="relative">
                <select
                  className={`${selCls} pr-8`}
                  value={form.audience}
                  onChange={e => set('audience', e.target.value)}
                >
                  {AUDIENCE_OPTS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Discipline / Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Discipline</label>
              <div className="relative">
                <select
                  className={`${selCls} pr-8`}
                  value={form.class_level}
                  onChange={e => set('class_level', e.target.value)}
                >
                  {LEVEL_OPTS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input
                className={inputCls}
                value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder="Main mat"
              />
            </div>
          </div>

          {/* Repeat type selector (create only) */}
          {!editing && (
            <div>
              <label className={labelCls}>Repeat</label>
              <div className="flex gap-6">
                {(['none', 'weekly'] as const).map(rt => (
                  <label key={rt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="repeat_type"
                      value={rt}
                      checked={form.repeat_type === rt}
                      onChange={() => set('repeat_type', rt)}
                      className="accent-bee-yellow w-4 h-4"
                    />
                    <span className="font-heading text-xs uppercase tracking-widest text-gray-400">
                      {rt === 'none' ? 'None' : 'Weekly'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Datetime fields — single event or edit */}
          {(editing || form.repeat_type === 'none') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Start *</label>
                <input
                  type="datetime-local"
                  className={inputCls}
                  required
                  value={form.start_time}
                  onChange={e => set('start_time', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>End *</label>
                <input
                  type="datetime-local"
                  className={inputCls}
                  required
                  value={form.end_time}
                  onChange={e => set('end_time', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Weekly recurrence fields (create only) */}
          {!editing && form.repeat_type === 'weekly' && (
            <div className="space-y-4 bg-gym-black border border-gym-charcoal-light p-4">
              <p className="font-heading text-[11px] uppercase tracking-widest text-gray-500">Weekly Schedule</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Start Date *</label>
                  <input
                    type="date"
                    className={inputCls}
                    required
                    value={form.recur_start_date}
                    onChange={e => set('recur_start_date', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>End Date *</label>
                  <input
                    type="date"
                    className={inputCls}
                    required
                    value={form.recur_end_date}
                    onChange={e => set('recur_end_date', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Day of Week *</label>
                <div className="relative">
                  <select
                    className={`${selCls} pr-8`}
                    value={form.recur_day}
                    onChange={e => set('recur_day', e.target.value)}
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Class Start Time *</label>
                  <input
                    type="time"
                    className={inputCls}
                    required
                    value={form.recur_start_time}
                    onChange={e => set('recur_start_time', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Class End Time *</label>
                  <input
                    type="time"
                    className={inputCls}
                    required
                    value={form.recur_end_time}
                    onChange={e => set('recur_end_time', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Published / Cancelled toggles */}
          <div className="flex gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={e => set('is_published', e.target.checked)}
                className="w-4 h-4 accent-bee-yellow"
              />
              <span className="font-heading text-xs uppercase tracking-widest text-gray-400">Published</span>
            </label>
            {editing && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_cancelled}
                  onChange={e => set('is_cancelled', e.target.checked)}
                  className="w-4 h-4 accent-gym-red"
                />
                <span className="font-heading text-xs uppercase tracking-widest text-gray-400">Cancelled</span>
              </label>
            )}
          </div>

          {/* Edit scope — only shown when editing a series event */}
          {editing && hasSeries && (
            <div className="bg-gym-black border border-gym-charcoal-light p-4">
              <p className="font-heading text-[11px] uppercase tracking-widest text-gray-500 mb-3">
                Save scope *
              </p>
              <div className="flex flex-col gap-2.5">
                {(
                  [
                    { v: 'this',   label: 'This event only'             },
                    { v: 'future', label: 'All future events in series' },
                    { v: 'all',    label: 'Entire series'               },
                  ] as { v: EditScope; label: string }[]
                ).map(opt => (
                  <label key={opt.v} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="editScope"
                      value={opt.v}
                      checked={editScope === opt.v}
                      onChange={() => setEditScope(opt.v)}
                      className="accent-bee-yellow w-4 h-4"
                    />
                    <span className="font-body text-sm text-gray-300">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 bg-gym-red/10 border border-gym-red/30 px-3 py-2.5">
              <AlertCircle size={15} className="text-gym-red shrink-0 mt-0.5" />
              <p className="font-body text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2 border-t border-gym-charcoal-light">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 font-heading font-bold uppercase tracking-widest bg-bee-yellow text-gym-black border-2 border-bee-yellow px-4 py-2.5 text-sm hover:bg-bee-yellow-bright transition-all disabled:opacity-50"
            >
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="font-heading font-bold uppercase tracking-widest bg-transparent text-gray-400 border-2 border-gym-charcoal-light px-4 py-2.5 text-sm hover:border-gray-500 hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── DeleteConfirm ────────────────────────────────────────────────────────────

function DeleteConfirm({
  event,
  onClose,
  onDeleted,
}: {
  event: CalendarEvent;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [scope, setScope]     = useState<EditScope>('this');
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState('');

  const hasSeries = Boolean(event.series_id);

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      if (!hasSeries || scope === 'this') {
        const { error: e } = await supabase
          .from('calendar_events').delete().eq('id', event.id);
        if (e) throw new Error(e.message);
      } else if (scope === 'future') {
        const { error: e } = await supabase
          .from('calendar_events').delete()
          .eq('series_id', event.series_id!)
          .gte('start_time', event.start_time);
        if (e) throw new Error(e.message);
      } else {
        const { error: e } = await supabase
          .from('calendar_events').delete()
          .eq('series_id', event.series_id!);
        if (e) throw new Error(e.message);
      }
      onDeleted();
    } catch (ex: unknown) {
      setError(ex instanceof Error ? ex.message : 'Delete failed.');
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.88)' }}
    >
      <div className="w-full max-w-sm bg-gym-charcoal border border-gym-charcoal-light">
        <div className="h-1 bg-gym-red" />
        <div className="px-6 py-6">
          <h2 className="font-display text-xl text-white uppercase mb-2">Delete Event?</h2>
          <p className="font-body text-sm text-gray-400 mb-1">Permanently removing:</p>
          <p className="font-heading text-sm text-white uppercase tracking-wide mb-4">{event.title}</p>

          {hasSeries && (
            <div className="mb-5">
              <p className="font-heading text-[11px] uppercase tracking-widest text-gray-500 mb-2">
                Delete scope *
              </p>
              <div className="flex flex-col gap-2.5">
                {(
                  [
                    { v: 'this',   label: 'This event only'             },
                    { v: 'future', label: 'All future events in series' },
                    { v: 'all',    label: 'Entire series'               },
                  ] as { v: EditScope; label: string }[]
                ).map(opt => (
                  <label key={opt.v} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="deleteScope"
                      value={opt.v}
                      checked={scope === opt.v}
                      onChange={() => setScope(opt.v)}
                      className="accent-gym-red w-4 h-4"
                    />
                    <span className="font-body text-sm text-gray-300">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <p className="font-body text-sm text-red-400 mb-4">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 font-heading font-bold uppercase tracking-widest bg-gym-red text-white border-2 border-gym-red px-4 py-2.5 text-sm hover:bg-gym-red-dark transition-all disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
            <button
              onClick={onClose}
              className="font-heading font-bold uppercase tracking-widest bg-transparent text-gray-400 border-2 border-gym-charcoal-light px-4 py-2.5 text-sm hover:border-gray-500 hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin display grouping ───────────────────────────────────────────────────

const DOW_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function fmtShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const AUDIENCE_LABEL: Record<string, string> = {
  all: 'All', adults: 'Adults', kids: 'Kids', women: 'Women',
};
const LEVEL_LABEL: Record<string, string> = {
  'all levels': 'All Levels', wrestling: 'Wrestling', gi: 'Gi',
  'no gi': 'No Gi', mma: 'MMA', 'open mat': 'Open Mat',
};

interface DisplayRow {
  /** Representative CalendarEvent (first occurrence for series, the event itself for singles) */
  rep: CalendarEvent;
  isSeries: boolean;
  seriesStart: string; // ISO — earliest start_time in series
  seriesEnd: string;   // ISO — latest start_time in series
  dowName: string;     // day-of-week name (series only)
  count: number;       // number of occurrences in series
}

function buildDisplayRows(events: CalendarEvent[]): DisplayRow[] {
  const seriesMap = new Map<string, CalendarEvent[]>();
  const singles: CalendarEvent[] = [];

  for (const ev of events) {
    if (ev.series_id) {
      if (!seriesMap.has(ev.series_id)) seriesMap.set(ev.series_id, []);
      seriesMap.get(ev.series_id)!.push(ev);
    } else {
      singles.push(ev);
    }
  }

  const rows: DisplayRow[] = [];

  // Series rows — one per series_id
  for (const [, occurrences] of seriesMap) {
    const sorted = [...occurrences].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );
    const rep        = sorted[0];
    const last       = sorted[sorted.length - 1];
    const dowName    = DOW_NAMES[new Date(rep.start_time).getDay()];
    rows.push({
      rep,
      isSeries:    true,
      seriesStart: rep.start_time,
      seriesEnd:   last.start_time,
      dowName,
      count:       sorted.length,
    });
  }

  // Single-event rows
  for (const ev of singles) {
    rows.push({ rep: ev, isSeries: false, seriesStart: ev.start_time, seriesEnd: ev.end_time, dowName: '', count: 1 });
  }

  // Sort display rows by their representative start_time
  rows.sort((a, b) => new Date(a.rep.start_time).getTime() - new Date(b.rep.start_time).getTime());

  return rows;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminCalendar() {
  const { session, loading: authLoading, user, signOut } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents]           = useState<CalendarEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [fetchError, setFetchError]   = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (!authLoading && !session) navigate('/admin/login', { replace: true });
  }, [session, authLoading, navigate]);

  const loadEvents = useCallback(async () => {
    setLoadingEvents(true);
    setFetchError('');
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_time', { ascending: true });
    if (error) {
      setFetchError(error.message);
    } else {
      setEvents((data as CalendarEvent[]) ?? []);
    }
    setLoadingEvents(false);
  }, []);

  useEffect(() => { if (session) loadEvents(); }, [session, loadEvents]);

  const togglePublish = async (ev: CalendarEvent) => {
    await supabase.from('calendar_events')
      .update({ is_published: !ev.is_published }).eq('id', ev.id);
    loadEvents();
  };

  const toggleCancel = async (ev: CalendarEvent) => {
    await supabase.from('calendar_events')
      .update({ is_cancelled: !ev.is_cancelled }).eq('id', ev.id);
    loadEvents();
  };

  const openCreate = () => { setEditingEvent(null); setModalOpen(true); };
  const openEdit   = (ev: CalendarEvent) => { setEditingEvent(ev); setModalOpen(true); };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gym-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-bee-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gym-black" style={{ paddingTop: 80 }}>

      {/* Header */}
      <div className="bg-gym-charcoal border-b border-gym-charcoal-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gym-red shrink-0" />
            <div>
              <h1 className="font-display text-2xl text-white uppercase leading-none">Calendar Admin</h1>
              <p className="font-heading text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openCreate}
              className="flex items-center gap-2 font-heading font-bold uppercase tracking-widest bg-bee-yellow text-gym-black border-2 border-bee-yellow px-4 py-2 text-xs hover:bg-bee-yellow-bright transition-all"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Event</span>
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-2 font-heading font-bold uppercase tracking-widest bg-transparent text-gray-500 border-2 border-gym-charcoal-light px-4 py-2 text-xs hover:border-gray-500 hover:text-white transition-all"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Event list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingEvents ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-bee-yellow border-t-transparent rounded-full animate-spin" />
          </div>
        ) : fetchError ? (
          <div className="flex items-start gap-3 bg-gym-red/10 border border-gym-red/30 px-5 py-4 max-w-lg">
            <AlertCircle size={18} className="text-gym-red shrink-0 mt-0.5" />
            <div>
              <p className="font-heading text-sm text-white uppercase tracking-wide">Failed to load events</p>
              <p className="font-body text-sm text-gray-400 mt-1">{fetchError}</p>
              <button onClick={loadEvents} className="font-heading text-xs uppercase tracking-widest text-bee-yellow mt-2 hover:text-bee-yellow-bright transition-colors">
                Retry
              </button>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gym-charcoal border border-gym-charcoal-light flex items-center justify-center mx-auto mb-5">
              <Plus size={24} className="text-gray-600" />
            </div>
            <p className="font-heading text-white uppercase tracking-widest text-sm mb-2">No events yet</p>
            <p className="font-body text-gray-600 text-sm mb-5">Create your first event to get started.</p>
            <button
              onClick={openCreate}
              className="font-heading font-bold uppercase tracking-widest bg-bee-yellow text-gym-black border-2 border-bee-yellow px-6 py-2.5 text-sm hover:bg-bee-yellow-bright transition-all"
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {buildDisplayRows(events).map(({ rep: ev, isSeries, seriesStart, seriesEnd, dowName, count }) => {
              const color     = TYPE_COLOR[ev.event_type] ?? '#6B7280';
              const typeLabel = EVENT_TYPE_OPTS.find(o => o.value === ev.event_type)?.label ?? ev.event_type;
              const audLabel  = AUDIENCE_LABEL[ev.audience] ?? ev.audience;
              const lvlLabel  = LEVEL_LABEL[ev.class_level] ?? ev.class_level;
              return (
                <div
                  key={isSeries ? `series-${ev.series_id}` : ev.id}
                  className="bg-gym-charcoal border border-gym-charcoal-light flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4"
                  style={{ borderLeft: `3px solid ${color}` }}
                >
                  {/* Date / time block */}
                  <div className="shrink-0 min-w-[150px]">
                    {isSeries ? (
                      <>
                        <div className="font-heading text-xs text-gray-400 uppercase tracking-widest">
                          Repeats Weekly · {dowName}
                        </div>
                        <div className="font-display text-base text-white leading-tight">
                          {fmtTime(ev.start_time)} – {fmtTime(ev.end_time)}
                        </div>
                        <div className="font-heading text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">
                          {fmtShortDate(seriesStart)} – {fmtShortDate(seriesEnd)}
                          <span className="ml-2 text-gray-700">{count} classes</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-heading text-xs text-gray-400 uppercase tracking-widest">{fmtDate(ev.start_time)}</div>
                        <div className="font-display text-base text-white leading-tight">
                          {fmtTime(ev.start_time)} – {fmtTime(ev.end_time)}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-lg leading-tight uppercase text-white">
                        {ev.title}
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {!ev.is_published && (
                          <span className="font-heading text-[9px] uppercase tracking-widest text-gray-600 border border-gym-charcoal-light px-1.5 py-0.5">Draft</span>
                        )}
                        {ev.is_cancelled && (
                          <span className="font-heading text-[9px] uppercase tracking-widest text-gym-red border border-gym-red/30 px-1.5 py-0.5">Cancelled</span>
                        )}
                        {isSeries && (
                          <span className="font-heading text-[9px] uppercase tracking-widest text-gray-600 border border-gym-charcoal-light px-1.5 py-0.5 flex items-center gap-1">
                            <RefreshCw size={8} />Series
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="font-heading text-[10px] uppercase tracking-widest" style={{ color }}>{typeLabel}</span>
                      {ev.audience && (
                        <span className="font-heading text-[10px] text-gray-600 uppercase tracking-widest">· {audLabel}</span>
                      )}
                      {ev.class_level && (
                        <span className="font-heading text-[10px] text-gray-600 uppercase tracking-widest">· {lvlLabel}</span>
                      )}
                      {ev.location && (
                        <span className="font-heading text-[10px] text-gray-600 uppercase tracking-widest">· {ev.location}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => togglePublish(ev)}
                      title={ev.is_published ? 'Unpublish' : 'Publish'}
                      className="p-2 text-gray-600 hover:text-bee-yellow transition-colors"
                    >
                      {ev.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => toggleCancel(ev)}
                      title={ev.is_cancelled ? 'Uncancel' : 'Cancel event'}
                      className="p-2 text-gray-600 hover:text-gym-red transition-colors"
                    >
                      {ev.is_cancelled ? <RotateCcw size={16} /> : <Ban size={16} />}
                    </button>
                    <button
                      onClick={() => openEdit(ev)}
                      title="Edit"
                      className="p-2 text-gray-600 hover:text-white transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(ev)}
                      title="Delete"
                      className="p-2 text-gray-600 hover:text-gym-red transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalOpen && (
        <EventModal
          editing={editingEvent}
          onClose={() => { setModalOpen(false); setEditingEvent(null); }}
          onSaved={() => { setModalOpen(false); setEditingEvent(null); loadEvents(); }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          event={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => { setDeleteTarget(null); loadEvents(); }}
        />
      )}
    </div>
  );
}
