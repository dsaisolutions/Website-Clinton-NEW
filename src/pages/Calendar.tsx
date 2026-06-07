import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CalendarEvent, EventType } from '../lib/supabase';
import CTASection from '../components/CTASection';

const TYPE_CFG: Record<EventType, { accent: string; bg: string; text: string; label: string; border: string }> = {
  bjj:        { accent: '#2563EB', bg: 'rgba(37,99,235,0.13)',  text: '#93C5FD', label: 'Jiu Jitsu', border: 'rgba(37,99,235,0.35)' },
  mma:        { accent: '#C41E1E', bg: 'rgba(196,30,30,0.14)',  text: '#FCA5A5', label: 'MMA',       border: 'rgba(196,30,30,0.45)' },
  wrestling:  { accent: '#D97706', bg: 'rgba(217,119,6,0.13)',  text: '#FCD34D', label: 'Wrestling', border: 'rgba(217,119,6,0.35)' },
  'open-mat': { accent: '#F5C400', bg: 'rgba(245,196,0,0.10)',  text: '#F5C400', label: 'Open Mat',  border: 'rgba(245,196,0,0.35)' },
  kids:       { accent: '#16A34A', bg: 'rgba(22,163,74,0.12)',  text: '#86EFAC', label: 'Kids',      border: 'rgba(22,163,74,0.35)' },
  other:      { accent: '#6B7280', bg: 'rgba(107,114,128,0.12)', text: '#D1D5DB', label: 'Other',   border: 'rgba(107,114,128,0.35)' },
};

const LEGEND_TYPES: EventType[] = ['bjj', 'mma', 'wrestling', 'kids', 'open-mat', 'other'];

function formatEventDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatEventTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function isSameDay(a: string, b: string) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate();
}

function groupEventsByDay(events: CalendarEvent[]): { dateKey: string; events: CalendarEvent[] }[] {
  const map = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const d = new Date(ev.start_time);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ev);
  }
  return Array.from(map.entries()).map(([dateKey, evts]) => ({ dateKey, events: evts }));
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<EventType | null>(null);

  const loadEvents = async () => {
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
  };

  useEffect(() => { loadEvents(); }, []);

  const filtered = activeFilter
    ? events.filter(e => e.event_type === activeFilter)
    : events;

  const grouped = groupEventsByDay(filtered);

  // Collect which event types are actually in the data for the legend
  const presentTypes = Array.from(new Set(events.map(e => e.event_type as EventType)));
  const legendTypes = LEGEND_TYPES.filter(t => presentTypes.includes(t));

  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <section className="relative bg-gym-black overflow-hidden" style={{ paddingTop: 'calc(80px + 3rem)' }}>
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gym-red" />

        <div
          className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="font-display leading-none text-white opacity-[0.02] whitespace-nowrap pl-8"
            style={{ fontSize: 'clamp(100px, 18vw, 260px)' }}
          >
            SCHEDULE
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-0.5 bg-gym-red" />
            <span className="font-heading text-gym-red uppercase tracking-[0.3em] text-xs font-bold">Weekly Training</span>
          </div>
          <h1
            className="font-display uppercase leading-none text-white mb-2"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}
          >
            Class <span className="text-bee-yellow">Schedule</span>
          </h1>
          <p className="font-body text-gray-500 text-sm max-w-md mt-2">
            Contact the gym to confirm current times before showing up.
          </p>

          {/* Legend / filter — only show if we have events */}
          {legendTypes.length > 0 && (
            <div className="flex flex-wrap gap-x-5 gap-y-3 mt-8 items-center">
              <span className="font-heading text-xs uppercase tracking-widest text-gray-700">Filter:</span>
              {legendTypes.map(t => {
                const cfg = TYPE_CFG[t];
                const isOn = activeFilter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setActiveFilter(isOn ? null : t)}
                    className="flex items-center gap-2 group transition-opacity"
                    style={{ opacity: activeFilter && !isOn ? 0.35 : 1 }}
                  >
                    <span
                      className="w-2 h-2 rotate-45 transition-transform group-hover:scale-125"
                      style={{ background: cfg.accent, boxShadow: isOn ? `0 0 6px ${cfg.accent}` : 'none' }}
                    />
                    <span
                      className="font-heading text-xs uppercase tracking-widest"
                      style={{ color: isOn ? cfg.text : '#6B7280' }}
                    >
                      {cfg.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div
          className="h-5 w-full"
          style={{ background: 'linear-gradient(to bottom right, #080808 49%, #131313 50%)' }}
        />
      </section>

      {/* ── SCHEDULE LIST ───────────────────────────────────────────── */}
      <section className="bg-gym-charcoal py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-2 border-bee-yellow border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-20 gap-5">
              <div className="flex items-start gap-3 bg-gym-red/10 border border-gym-red/30 px-6 py-4 max-w-lg w-full">
                <AlertCircle size={18} className="text-gym-red shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading text-sm text-white uppercase tracking-wide">Could not load schedule</p>
                  <p className="font-body text-sm text-gray-400 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={loadEvents}
                className="flex items-center gap-2 font-heading text-xs uppercase tracking-widest text-bee-yellow hover:text-bee-yellow-bright transition-colors"
              >
                <RefreshCw size={14} />
                Try again
              </button>
            </div>
          ) : grouped.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-px bg-gym-charcoal-light mx-auto mb-8" />
              <p className="font-display text-3xl text-white uppercase mb-3">
                {activeFilter ? 'No matching classes' : 'Schedule Coming Soon'}
              </p>
              <p className="font-body text-gray-500 text-sm max-w-sm mx-auto">
                {activeFilter
                  ? 'No published events for this discipline.'
                  : 'Check back soon or call the gym to confirm current class times.'}
              </p>
              {activeFilter && (
                <button
                  onClick={() => setActiveFilter(null)}
                  className="mt-5 font-heading text-xs uppercase tracking-widest text-bee-yellow hover:text-bee-yellow-bright transition-colors"
                >
                  Clear filter
                </button>
              )}
              <div className="w-16 h-px bg-gym-charcoal-light mx-auto mt-8" />
            </div>
          ) : (
            <div className="space-y-10">
              {grouped.map(({ dateKey, events: dayEvents }) => (
                <div key={dateKey}>
                  {/* Day header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-1 h-6 bg-gym-red shrink-0" />
                    <h2 className="font-heading text-sm uppercase tracking-widest text-white">
                      {formatEventDate(dayEvents[0].start_time)}
                    </h2>
                    <div className="flex-1 h-px bg-gym-charcoal-light" />
                  </div>

                  {/* Event cards */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dayEvents.map(ev => {
                      const cfg = TYPE_CFG[ev.event_type as EventType] ?? TYPE_CFG.other;
                      return (
                        <div
                          key={ev.id}
                          className="relative overflow-hidden bg-gym-black"
                          style={{
                            borderLeft: `3px solid ${ev.is_cancelled ? '#374151' : cfg.accent}`,
                            background: ev.is_cancelled ? 'rgba(8,8,8,0.5)' : cfg.bg,
                            opacity: ev.is_cancelled ? 0.55 : 1,
                          }}
                        >
                          {/* Corner glow */}
                          {!ev.is_cancelled && (
                            <div
                              className="absolute top-0 right-0 w-16 h-full pointer-events-none"
                              style={{ background: `linear-gradient(to bottom-left, ${cfg.accent}25, transparent 70%)` }}
                            />
                          )}

                          <div className="relative px-4 py-4">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span
                                  className="font-heading text-[10px] uppercase tracking-[0.2em] font-bold block"
                                  style={{ color: ev.is_cancelled ? '#6B7280' : cfg.accent }}
                                >
                                  {cfg.label}
                                </span>
                                <span
                                  className={`font-display text-2xl leading-tight uppercase block mt-0.5 ${ev.is_cancelled ? 'line-through text-gray-600' : 'text-white'}`}
                                >
                                  {ev.title}
                                </span>
                              </div>
                              {ev.is_cancelled && (
                                <span className="font-heading text-[9px] uppercase tracking-widest text-gym-red border border-gym-red/30 px-1.5 py-0.5 shrink-0 mt-0.5">
                                  Cancelled
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className="font-display text-lg leading-none"
                                style={{ color: ev.is_cancelled ? '#6B7280' : cfg.text }}
                              >
                                {formatEventTime(ev.start_time)}
                              </span>
                              <span className="font-body text-xs text-gray-600">–</span>
                              <span
                                className="font-body text-xs"
                                style={{ color: ev.is_cancelled ? '#6B7280' : '#9CA3AF' }}
                              >
                                {formatEventTime(ev.end_time)}
                              </span>
                            </div>

                            {ev.class_level && ev.class_level !== 'all levels' ? (
                              <p className="font-body text-[11px] text-gray-600 mt-1">{ev.class_level}</p>
                            ) : null}
                            {ev.audience && ev.audience !== 'all' ? (
                              <p className="font-body text-[11px] text-gray-600">{ev.audience}</p>
                            ) : null}
                            {ev.description ? (
                              <p className="font-body text-[11px] text-gray-600 mt-1 line-clamp-2">{ev.description}</p>
                            ) : null}
                            {ev.location ? (
                              <p className="font-body text-[10px] text-gray-700 mt-1.5 uppercase tracking-wider">{ev.location}</p>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
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
              <a
                href="tel:6019668358"
                className="font-heading text-bee-yellow border border-bee-yellow px-5 py-2.5 text-sm uppercase tracking-widest hover:bg-bee-yellow hover:text-gym-black transition-all whitespace-nowrap"
              >
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
    </>
  );
}
