import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, MapPin, Users, BarChart2, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CalendarEvent } from '../lib/supabase';
import CTASection from '../components/CTASection';

// ─── Colour config ────────────────────────────────────────────────────────────

type DisciplineKey =
  | 'gi'
  | 'no gi'
  | 'mma'
  | 'wrestling'
  | 'open mat'
  | 'workshop'
  | 'other';

const TYPE_CFG: Record<DisciplineKey, { accent: string; bg: string; text: string; label: string }> = {
  gi: {
    accent: '#2563EB',
    bg: 'rgba(37,99,235,0.18)',
    text: '#93C5FD',
    label: 'Gi',
  },
  'no gi': {
    accent: '#16A34A',
    bg: 'rgba(22,163,74,0.16)',
    text: '#86EFAC',
    label: 'No Gi',
  },
  mma: {
    accent: '#C41E1E',
    bg: 'rgba(196,30,30,0.18)',
    text: '#FCA5A5',
    label: 'MMA',
  },
  wrestling: {
    accent: '#D97706',
    bg: 'rgba(217,119,6,0.18)',
    text: '#FCD34D',
    label: 'Wrestling',
  },
  'open mat': {
    accent: '#F5C400',
    bg: 'rgba(245,196,0,0.14)',
    text: '#F5C400',
    label: 'Open Mat',
  },
  workshop: {
    accent: '#A855F7',
    bg: 'rgba(168,85,247,0.16)',
    text: '#D8B4FE',
    label: 'Workshop',
  },
  other: {
    accent: '#6B7280',
    bg: 'rgba(107,114,128,0.14)',
    text: '#D1D5DB',
    label: 'Other',
  },
};

function disciplineKey(event: CalendarEvent): DisciplineKey {
  if (event.event_type === 'workshop') return 'workshop';

  const level = event.class_level?.toLowerCase();

  if (
    level === 'gi' ||
    level === 'no gi' ||
    level === 'mma' ||
    level === 'wrestling' ||
    level === 'open mat'
  ) {
    return level;
  }

  return 'other';
}

function cfg(event: CalendarEvent) {
  return TYPE_CFG[disciplineKey(event)] ?? TYPE_CFG.other;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns a grid of day-numbers (0 = empty padding cell). */
function buildGrid(year: number, month: number): number[] {
  const firstDow = startOfMonth(year, month).getDay(); // 0=Sun
  const total = daysInMonth(year, month);
  const cells: number[] = Array(firstDow).fill(0);
  for (let d = 1; d <= total; d++) cells.push(d);
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(0);
  return cells;
}

function isoDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DOW_FULL  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DOW_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ─── Display formatters ───────────────────────────────────────────────────────

const AUDIENCE_LABELS: Record<string, string> = {
  kids: 'Kids',
  adults: 'Adults',
  all: 'All',
  women: 'Women',
};

const LEVEL_LABELS: Record<string, string> = {
  wrestling: 'Wrestling',
  gi: 'Gi',
  'no gi': 'No Gi',
  mma: 'MMA',
  'open mat': 'Open Mat',
  'all levels': 'All Levels',
};

function fmtAudience(v: string) { return AUDIENCE_LABELS[v] ?? v; }
function fmtLevel(v: string)    { return LEVEL_LABELS[v]    ?? v; }

// ─── Event grouping ───────────────────────────────────────────────────────────

function groupByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const d = new Date(ev.start_time);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ev);
  }
  return map;
}

// ─── Event detail modal ───────────────────────────────────────────────────────

function EventModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  const c = cfg(event);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-gym-charcoal border border-gym-charcoal-light overflow-hidden"
           style={{ borderLeft: `4px solid ${c.accent}` }}>
        {/* Top accent */}
        <div className="h-0.5 w-full" style={{ background: c.accent }} />

        {/* Corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
             style={{ background: `radial-gradient(circle at top right, ${c.accent}20, transparent 70%)` }} />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gym-charcoal-light">
          <div className="flex-1 min-w-0 pr-4">
            <span className="font-heading text-[10px] uppercase tracking-[0.25em] font-bold block mb-1" style={{ color: c.accent }}>
              {c.label}
            </span>
            <h2 className={`font-display text-3xl uppercase leading-none ${event.is_cancelled ? 'line-through text-gray-500' : 'text-white'}`}>
              {event.title}
            </h2>
            {event.is_cancelled && (
              <div className="flex items-center gap-1.5 mt-2">
                <AlertTriangle size={12} className="text-gym-red" />
                <span className="font-heading text-xs uppercase tracking-widest text-gym-red">Cancelled</span>
              </div>
            )}
          </div>
          <button onClick={onClose}
                  className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-white transition-colors border border-gym-charcoal-light hover:border-gray-500">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Date / time */}
          <div className="flex items-start gap-3">
            <Clock size={14} className="text-gray-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-heading text-xs uppercase tracking-widest text-gray-500 mb-0.5">Date & Time</p>
              <p className="font-body text-sm text-white">{formatFullDate(event.start_time)}</p>
              <p className="font-heading text-sm text-white mt-0.5">
                {formatTime(event.start_time)}
                <span className="text-gray-600 mx-1.5">–</span>
                {formatTime(event.end_time)}
              </p>
            </div>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 gap-4">
            {(event.audience && event.audience !== 'all') && (
              <div className="flex items-start gap-2">
                <Users size={13} className="text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-heading text-[10px] uppercase tracking-widest text-gray-600">Audience</p>
                  <p className="font-body text-sm text-white">{fmtAudience(event.audience)}</p>
                </div>
              </div>
            )}
            {(event.class_level && event.class_level !== 'all levels') && (
              <div className="flex items-start gap-2">
                <BarChart2 size={13} className="text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-heading text-[10px] uppercase tracking-widest text-gray-600">Discipline</p>
                  <p className="font-body text-sm text-white">{fmtLevel(event.class_level)}</p>
                </div>
              </div>
            )}
          </div>

          {event.location && (
            <div className="flex items-start gap-2">
              <MapPin size={13} className="text-gray-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-heading text-[10px] uppercase tracking-widest text-gray-600">Location</p>
                <p className="font-body text-sm text-white">{event.location}</p>
              </div>
            </div>
          )}

          {event.description && (
            <div className="pt-1 border-t border-gym-charcoal-light">
              <p className="font-body text-sm text-gray-400 leading-relaxed">{event.description}</p>
            </div>
          )}
        </div>

        {/* Bottom accent */}
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${c.accent}, transparent)` }} />
      </div>
    </div>
  );
}

// ─── Pill shown in a grid cell ─────────────────────────────────────────────────

function EventPill({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const c = cfg(event);
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-1.5 py-0.5 mb-0.5 text-[10px] leading-tight truncate transition-opacity hover:opacity-80 focus:outline-none"
      style={{
        background: event.is_cancelled ? 'rgba(107,114,128,0.12)' : c.bg,
        borderLeft: `2px solid ${event.is_cancelled ? '#4B5563' : c.accent}`,
        color: event.is_cancelled ? '#6B7280' : c.text,
        textDecoration: event.is_cancelled ? 'line-through' : 'none',
      }}
      title={event.title}
    >
      <span className="font-heading tracking-wide">{formatTime(event.start_time)}</span>
      {' '}
      <span className="font-body">{event.title}</span>
    </button>
  );
}

// ─── Agenda item (mobile) ─────────────────────────────────────────────────────

function AgendaEvent({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const c = cfg(event);
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gym-charcoal-light hover:bg-gym-charcoal-mid transition-colors focus:outline-none"
    >
      <div className="shrink-0 w-0.5 self-stretch mt-1" style={{ background: event.is_cancelled ? '#4B5563' : c.accent }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-heading text-[10px] uppercase tracking-widest" style={{ color: event.is_cancelled ? '#6B7280' : c.accent }}>
            {c.label}
          </span>
          {event.is_cancelled && (
            <span className="font-heading text-[9px] uppercase tracking-widest text-gym-red border border-gym-red/30 px-1 py-0.5 leading-none">Cancelled</span>
          )}
        </div>
        <span className={`font-display text-xl uppercase leading-tight block ${event.is_cancelled ? 'line-through text-gray-600' : 'text-white'}`}>
          {event.title}
        </span>
        <span className="font-heading text-xs text-gray-500 mt-0.5 block">
          {formatTime(event.start_time)} – {formatTime(event.end_time)}
          {event.class_level && event.class_level !== 'all levels' && (
            <span className="ml-2 text-gray-600">{fmtLevel(event.class_level)}</span>
          )}
        </span>
      </div>
      <ChevronRight size={14} className="text-gray-700 shrink-0 mt-1.5" />
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Calendar() {
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [events, setEvents]       = useState<CalendarEvent[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [selected, setSelected]   = useState<CalendarEvent | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: dbErr } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('is_published', true)
      .order('start_time', { ascending: true });

    if (dbErr) {
      setError(dbErr.message);
    } else {
      setEvents((data as CalendarEvent[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const goToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); };

  const byDate  = groupByDate(events);
  const grid    = buildGrid(viewYear, viewMonth);
  const todayKey = isoDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  // Agenda: all events in the current view month sorted by start_time
  const agendaEvents = events.filter(ev => {
    const d = new Date(ev.start_time);
    return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
  });

  // Group agenda by day for display
  const agendaByDay = new Map<string, { day: number; events: CalendarEvent[] }>();
  for (const ev of agendaEvents) {
    const d = new Date(ev.start_time);
    const key = isoDateKey(viewYear, viewMonth, d.getDate());
    if (!agendaByDay.has(key)) agendaByDay.set(key, { day: d.getDate(), events: [] });
    agendaByDay.get(key)!.events.push(ev);
  }
  const agendaDays = Array.from(agendaByDay.values()).sort((a, b) => a.day - b.day);

  return (
    <>
      {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
      <section className="relative bg-gym-black overflow-hidden" style={{ paddingTop: 'calc(80px + 3rem)' }}>
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gym-red" />
        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <span className="font-display leading-none text-white opacity-[0.02] whitespace-nowrap pl-8"
                style={{ fontSize: 'clamp(100px, 18vw, 260px)' }}>SCHEDULE</span>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-0.5 bg-gym-red" />
            <span className="font-heading text-gym-red uppercase tracking-[0.3em] text-xs font-bold">Monthly Schedule</span>
          </div>
          <h1 className="font-display uppercase leading-none text-white mb-2"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}>
            Class <span className="text-bee-yellow">Schedule</span>
          </h1>
          <p className="font-body text-gray-500 text-sm max-w-md mt-2">
            Contact the gym to confirm current times before showing up.
          </p>
        </div>

        <div className="h-5 w-full"
             style={{ background: 'linear-gradient(to bottom right, #080808 49%, #131313 50%)' }} />
      </section>

      {/* ── CALENDAR SECTION ────────────────────────────────────────── */}
      <section className="bg-gym-charcoal py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Month nav */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <button onClick={prevMonth}
                      className="w-9 h-9 flex items-center justify-center border border-gym-charcoal-light text-gray-400 hover:text-bee-yellow hover:border-bee-yellow transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button onClick={nextMonth}
                      className="w-9 h-9 flex items-center justify-center border border-gym-charcoal-light text-gray-400 hover:text-bee-yellow hover:border-bee-yellow transition-colors">
                <ChevronRight size={18} />
              </button>
              <h2 className="font-display text-3xl md:text-4xl text-white uppercase leading-none">
                {MONTH_NAMES[viewMonth]} <span className="text-bee-yellow">{viewYear}</span>
              </h2>
            </div>
            <button onClick={goToday}
                    className="font-heading text-xs uppercase tracking-widest text-gray-400 border border-gym-charcoal-light px-4 py-2 hover:text-bee-yellow hover:border-bee-yellow transition-colors shrink-0">
              Today
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-2 border-bee-yellow border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 bg-gym-red/10 border border-gym-red/30 px-5 py-4 max-w-lg">
              <AlertTriangle size={18} className="text-gym-red shrink-0 mt-0.5" />
              <div>
                <p className="font-heading text-sm text-white uppercase tracking-wide">Could not load schedule</p>
                <p className="font-body text-sm text-gray-400 mt-1">{error}</p>
                <button onClick={loadEvents} className="font-heading text-xs uppercase tracking-widest text-bee-yellow mt-2 hover:text-bee-yellow-bright transition-colors">
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ── DESKTOP GRID (md+) ──────────────────────────────── */}
              <div className="hidden md:block">
                {/* DOW headers */}
                <div className="grid grid-cols-7 mb-1 gap-px">
                  {DOW_FULL.map(d => (
                    <div key={d} className="py-2 text-center">
                      <span className="font-heading text-[10px] uppercase tracking-widest text-gray-600">{d}</span>
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-px bg-gym-charcoal-light">
                  {grid.map((day, idx) => {
                    if (day === 0) {
                      return <div key={`empty-${idx}`} className="bg-gym-black min-h-[110px] opacity-30" />;
                    }
                    const key = isoDateKey(viewYear, viewMonth, day);
                    const dayEvents = byDate.get(key) ?? [];
                    const isToday = key === todayKey;
                    const MAX_SHOWN = 3;
                    const overflow = dayEvents.length - MAX_SHOWN;

                    return (
                      <div key={key}
                           className={`bg-gym-black min-h-[110px] p-2 flex flex-col ${isToday ? 'ring-1 ring-inset ring-bee-yellow' : ''}`}>
                        {/* Day number */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`font-display text-lg leading-none ${
                            isToday ? 'text-bee-yellow' : 'text-gray-600'
                          }`}>
                            {day}
                          </span>
                          {isToday && (
                            <span className="font-heading text-[8px] uppercase tracking-widest text-bee-yellow border border-bee-yellow px-1 py-0.5 leading-none">
                              Today
                            </span>
                          )}
                        </div>

                        {/* Event pills */}
                        <div className="flex-1 overflow-hidden">
                          {dayEvents.slice(0, MAX_SHOWN).map(ev => (
                            <EventPill key={ev.id} event={ev} onClick={() => setSelected(ev)} />
                          ))}
                          {overflow > 0 && (
                            <button
                              className="font-heading text-[9px] uppercase tracking-widest text-gray-600 hover:text-bee-yellow transition-colors mt-0.5 pl-1"
                              onClick={() => setSelected(dayEvents[MAX_SHOWN])}
                            >
                              +{overflow} more
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── MOBILE AGENDA (< md) ─────────────────────────────── */}
              <div className="md:hidden">
                {/* DOW row compact header for context */}
                <div className="grid grid-cols-7 mb-3 gap-px">
                  {DOW_SHORT.map(d => (
                    <div key={d} className="py-1 text-center">
                      <span className="font-heading text-[9px] uppercase tracking-wider text-gray-700">{d}</span>
                    </div>
                  ))}
                </div>

                {/* Mini dot grid */}
                <div className="grid grid-cols-7 gap-px bg-gym-charcoal-light mb-6">
                  {grid.map((day, idx) => {
                    if (day === 0) {
                      return <div key={`me-${idx}`} className="bg-gym-black h-10 opacity-20" />;
                    }
                    const key = isoDateKey(viewYear, viewMonth, day);
                    const dayEvents = byDate.get(key) ?? [];
                    const isToday = key === todayKey;
                    const hasDot = dayEvents.length > 0;
                    const firstActiveEvent = dayEvents.find(e => !e.is_cancelled);

                    return (
                      <div key={key}
                           className={`bg-gym-black h-10 flex flex-col items-center justify-center gap-0.5 ${isToday ? 'ring-1 ring-inset ring-bee-yellow' : ''}`}>
                        <span className={`font-display text-base leading-none ${isToday ? 'text-bee-yellow' : 'text-gray-500'}`}>
                          {day}
                        </span>
                        {hasDot && (
                          <span className="w-1 h-1 rounded-full" style={{
                            background: firstActiveEvent ? cfg(firstActiveEvent).accent : '#4B5563',
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Agenda list */}
                {agendaDays.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-heading text-sm uppercase tracking-widest text-gray-600">No classes this month</p>
                  </div>
                ) : (
                  <div className="border-t border-gym-charcoal-light">
                    {agendaDays.map(({ day, events: dayEvts }) => {
                      const key = isoDateKey(viewYear, viewMonth, day);
                      const isToday = key === todayKey;
                      const d = new Date(viewYear, viewMonth, day);
                      return (
                        <div key={key}>
                          {/* Day header */}
                          <div className={`flex items-center gap-3 px-4 py-2 border-b border-gym-charcoal-light ${isToday ? 'bg-bee-yellow/5' : 'bg-gym-black'}`}>
                            <div className={`w-0.5 h-4 ${isToday ? 'bg-bee-yellow' : 'bg-gym-red'}`} />
                            <span className="font-heading text-xs uppercase tracking-widest text-white">
                              {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            {isToday && (
                              <span className="font-heading text-[9px] uppercase tracking-widest text-bee-yellow border border-bee-yellow px-1 py-0.5 leading-none ml-1">
                                Today
                              </span>
                            )}
                          </div>
                          {/* Events */}
                          {dayEvts.map(ev => (
                            <AgendaEvent key={ev.id} event={ev} onClick={() => setSelected(ev)} />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Empty month message (both views) */}
              {agendaEvents.length === 0 && !loading && !error && (
                <div className="hidden md:flex flex-col items-center py-8 mt-2">
                  <p className="font-heading text-xs uppercase tracking-widest text-gray-700">
                    No published classes for {MONTH_NAMES[viewMonth]} {viewYear}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Legend */}
          {!loading && !error && events.length > 0 && (
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 pt-5 border-t border-gym-charcoal-light">
              <span className="font-heading text-[10px] uppercase tracking-widest text-gray-700 self-center">Discipline:</span>
              {(Object.entries(TYPE_CFG) as [DisciplineKey, typeof TYPE_CFG[DisciplineKey]][])
                .filter(([t]) => t !== 'other' && events.some(ev => disciplineKey(ev) === t))
                .map(([t, c]) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rotate-45 inline-block" style={{ background: c.accent }} />
                    <span className="font-heading text-[10px] uppercase tracking-widest" style={{ color: c.text }}>{c.label}</span>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACT STRIP ──────────────────────────────────────────── */}
      <section className="bg-gym-black border-t border-gym-charcoal-light">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <p className="font-body text-gray-600 text-sm max-w-lg">
              Schedule is updated regularly. Call the gym to confirm current class times.
            </p>
            <div className="flex items-center gap-4 border border-gym-charcoal-light px-5 py-4 shrink-0">
              <div>
                <p className="font-heading text-white uppercase tracking-wide text-sm">Questions?</p>
                <p className="font-body text-gray-600 text-xs mt-0.5">Call to confirm times.</p>
              </div>
              <a href="tel:6019668358"
                 className="font-heading text-bee-yellow border border-bee-yellow px-5 py-2.5 text-sm uppercase tracking-widest hover:bg-bee-yellow hover:text-gym-black transition-all whitespace-nowrap">
                601-966-8358
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        headline="Ready to Show Up?"
        primaryLabel="Contact the Gym"
        primaryTo="/contact"
        secondaryLabel="Meet the Instructors"
        secondaryTo="/instructors"
      />

      {/* ── DETAIL MODAL ────────────────────────────────────────────── */}
      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
    </>
  );
}