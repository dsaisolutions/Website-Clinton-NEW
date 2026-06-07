import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard as Edit2, Trash2, Eye, EyeOff, Ban, RotateCcw, LogOut, AlertCircle, X, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CalendarEvent, EventType } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const EVENT_TYPE_OPTS: { value: EventType; label: string }[] = [
  { value: 'bjj', label: 'Jiu Jitsu' },
  { value: 'mma', label: 'MMA' },
  { value: 'wrestling', label: 'Wrestling' },
  { value: 'kids', label: 'Kids' },
  { value: 'open-mat', label: 'Open Mat' },
  { value: 'other', label: 'Other' },
];

const TYPE_COLOR: Record<EventType, string> = {
  bjj: '#2563EB',
  mma: '#C41E1E',
  wrestling: '#D97706',
  kids: '#16A34A',
  'open-mat': '#F5C400',
  other: '#6B7280',
};

function formatLocalDatetime(iso: string) {
  if (!iso) return '';
  return iso.slice(0, 16); // YYYY-MM-DDTHH:MM
}

function toLocalISOString(localDatetime: string): string {
  if (!localDatetime) return '';
  // Input is local YYYY-MM-DDTHH:MM — convert to UTC ISO string
  const d = new Date(localDatetime);
  return d.toISOString();
}

interface FormState {
  title: string;
  description: string;
  event_type: EventType;
  audience: string;
  class_level: string;
  start_time: string;
  end_time: string;
  location: string;
  is_published: boolean;
  is_cancelled: boolean;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  event_type: 'bjj',
  audience: 'all',
  class_level: 'all levels',
  start_time: '',
  end_time: '',
  location: '',
  is_published: false,
  is_cancelled: false,
};

function toFormState(ev: CalendarEvent): FormState {
  return {
    title: ev.title,
    description: ev.description ?? '',
    event_type: ev.event_type as EventType,
    audience: ev.audience,
    class_level: ev.class_level,
    start_time: formatLocalDatetime(ev.start_time),
    end_time: formatLocalDatetime(ev.end_time),
    location: ev.location ?? '',
    is_published: ev.is_published,
    is_cancelled: ev.is_cancelled,
  };
}

function EventModal({
  editing,
  onClose,
  onSaved,
}: {
  editing: CalendarEvent | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(editing ? toFormState(editing) : EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (k: keyof FormState, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.start_time || !form.end_time) {
      setError('Start and end times are required.');
      return;
    }
    if (new Date(form.start_time) >= new Date(form.end_time)) {
      setError('End time must be after start time.');
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      event_type: form.event_type,
      audience: form.audience.trim() || 'all',
      class_level: form.class_level.trim() || 'all levels',
      start_time: toLocalISOString(form.start_time),
      end_time: toLocalISOString(form.end_time),
      location: form.location.trim() || null,
      is_published: form.is_published,
      is_cancelled: form.is_cancelled,
    };

    const { error: dbErr } = editing
      ? await supabase.from('calendar_events').update(payload).eq('id', editing.id)
      : await supabase.from('calendar_events').insert(payload);

    setSaving(false);

    if (dbErr) {
      setError(dbErr.message);
    } else {
      onSaved();
    }
  };

  const inputCls =
    'w-full bg-gym-black border border-gym-charcoal-light text-white font-body text-sm px-3 py-2.5 focus:outline-none focus:border-bee-yellow transition-colors placeholder-gray-700';
  const labelCls = 'font-heading text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
    >
      <div className="relative w-full max-w-xl bg-gym-charcoal border border-gym-charcoal-light overflow-y-auto max-h-[90vh]">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Event Type *</label>
              <div className="relative">
                <select
                  className={`${inputCls} appearance-none pr-8`}
                  value={form.event_type}
                  onChange={e => set('event_type', e.target.value as EventType)}
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
              <input
                className={inputCls}
                value={form.audience}
                onChange={e => set('audience', e.target.value)}
                placeholder="all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Class Level</label>
              <input
                className={inputCls}
                value={form.class_level}
                onChange={e => set('class_level', e.target.value)}
                placeholder="all levels"
              />
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Start Time *</label>
              <input
                type="datetime-local"
                className={inputCls}
                required
                value={form.start_time}
                onChange={e => set('start_time', e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>End Time *</label>
              <input
                type="datetime-local"
                className={inputCls}
                required
                value={form.end_time}
                onChange={e => set('end_time', e.target.value)}
              />
            </div>
          </div>

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

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_cancelled}
                onChange={e => set('is_cancelled', e.target.checked)}
                className="w-4 h-4 accent-gym-red"
              />
              <span className="font-heading text-xs uppercase tracking-widest text-gray-400">Cancelled</span>
            </label>
          </div>

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

function DeleteConfirm({ event, onClose, onDeleted }: { event: CalendarEvent; onClose: () => void; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setDeleting(true);
    const { error: dbErr } = await supabase.from('calendar_events').delete().eq('id', event.id);
    if (dbErr) {
      setError(dbErr.message);
      setDeleting(false);
    } else {
      onDeleted();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
    >
      <div className="w-full max-w-sm bg-gym-charcoal border border-gym-charcoal-light">
        <div className="h-1 bg-gym-red" />
        <div className="px-6 py-6">
          <h2 className="font-display text-xl text-white uppercase mb-2">Delete Event?</h2>
          <p className="font-body text-sm text-gray-400 mb-1">
            This will permanently remove:
          </p>
          <p className="font-heading text-sm text-white uppercase tracking-wide mb-5">{event.title}</p>
          {error && (
            <p className="font-body text-sm text-red-400 mb-4">{error}</p>
          )}
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

function formatEventDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatEventTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function AdminCalendar() {
  const { session, loading: authLoading, user, signOut } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/admin/login', { replace: true });
    }
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

  useEffect(() => {
    if (session) loadEvents();
  }, [session, loadEvents]);

  const togglePublish = async (ev: CalendarEvent) => {
    await supabase
      .from('calendar_events')
      .update({ is_published: !ev.is_published })
      .eq('id', ev.id);
    loadEvents();
  };

  const toggleCancel = async (ev: CalendarEvent) => {
    await supabase
      .from('calendar_events')
      .update({ is_cancelled: !ev.is_cancelled })
      .eq('id', ev.id);
    loadEvents();
  };

  const openCreate = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const openEdit = (ev: CalendarEvent) => {
    setEditingEvent(ev);
    setModalOpen(true);
  };

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

      {/* Content */}
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
            {events.map(ev => {
              const color = TYPE_COLOR[ev.event_type as EventType] ?? '#6B7280';
              return (
                <div
                  key={ev.id}
                  className="bg-gym-charcoal border border-gym-charcoal-light flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 relative group"
                  style={{ borderLeft: `3px solid ${color}` }}
                >
                  {/* Status badges */}
                  <div className="flex gap-1.5 shrink-0 sm:hidden mb-1">
                    {!ev.is_published && (
                      <span className="font-heading text-[9px] uppercase tracking-widest text-gray-600 border border-gym-charcoal-light px-1.5 py-0.5">Draft</span>
                    )}
                    {ev.is_cancelled && (
                      <span className="font-heading text-[9px] uppercase tracking-widest text-gym-red border border-gym-red/30 px-1.5 py-0.5">Cancelled</span>
                    )}
                  </div>

                  {/* Date/Time */}
                  <div className="shrink-0 min-w-[130px]">
                    <div className="font-heading text-xs text-gray-400 uppercase tracking-widest">{formatEventDate(ev.start_time)}</div>
                    <div className="font-display text-base text-white leading-tight">
                      {formatEventTime(ev.start_time)} – {formatEventTime(ev.end_time)}
                    </div>
                  </div>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-display text-lg leading-tight uppercase ${ev.is_cancelled ? 'line-through opacity-50' : ''}`}
                        style={{ color: ev.is_cancelled ? '#6B7280' : 'white' }}
                      >
                        {ev.title}
                      </span>
                      {/* Desktop badges */}
                      <div className="hidden sm:flex gap-1.5">
                        {!ev.is_published && (
                          <span className="font-heading text-[9px] uppercase tracking-widest text-gray-600 border border-gym-charcoal-light px-1.5 py-0.5">Draft</span>
                        )}
                        {ev.is_cancelled && (
                          <span className="font-heading text-[9px] uppercase tracking-widest text-gym-red border border-gym-red/30 px-1.5 py-0.5">Cancelled</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="font-heading text-[10px] uppercase tracking-widest" style={{ color }}>
                        {EVENT_TYPE_OPTS.find(o => o.value === ev.event_type)?.label ?? ev.event_type}
                      </span>
                      {ev.audience && ev.audience !== 'all' && (
                        <span className="font-heading text-[10px] text-gray-600 uppercase tracking-widest">{ev.audience}</span>
                      )}
                      {ev.location && (
                        <span className="font-heading text-[10px] text-gray-600 uppercase tracking-widest">{ev.location}</span>
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
                      <Edit2 size={16} />
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
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); loadEvents(); }}
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
