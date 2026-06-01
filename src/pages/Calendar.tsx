import { useState } from 'react';
import CTASection from '../components/CTASection';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
const DAY_SHORT = ['MON', 'TUE', 'WED', 'THU', 'SAT'];

// Evening slots (Mon–Thu view)
const EVE_SLOTS = [
  '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM',
];

type ClassType = 'bjj' | 'mma' | 'wrestling' | 'open-mat' | 'kids';

interface ClassBlock {
  day: string;
  startSlot: number; // index into EVE_SLOTS (Saturday uses a virtual offset)
  span: number;
  name: string;
  type: ClassType;
  detail: string;
  displayTime: string;
}

const CLASSES: ClassBlock[] = [
  { day: 'Monday',    startSlot: 1, span: 2, name: 'Kids Jiu Jitsu',  type: 'kids',      detail: 'Ages 5–14 · All levels',   displayTime: '5:00 PM' },
  { day: 'Monday',    startSlot: 3, span: 2, name: 'Adult Jiu Jitsu', type: 'bjj',       detail: 'Gi & No-Gi · All levels',   displayTime: '6:00 PM' },
  { day: 'Tuesday',   startSlot: 3, span: 2, name: 'MMA',             type: 'mma',       detail: 'Striking + Grappling',      displayTime: '6:00 PM' },
  { day: 'Wednesday', startSlot: 1, span: 2, name: 'Kids Jiu Jitsu',  type: 'kids',      detail: 'Ages 5–14 · All levels',   displayTime: '5:00 PM' },
  { day: 'Wednesday', startSlot: 3, span: 2, name: 'Adult Jiu Jitsu', type: 'bjj',       detail: 'Gi & No-Gi · All levels',   displayTime: '6:00 PM' },
  { day: 'Thursday',  startSlot: 3, span: 2, name: 'Wrestling',       type: 'wrestling', detail: 'Folkstyle · Freestyle',     displayTime: '6:00 PM' },
  { day: 'Saturday',  startSlot: 2, span: 2, name: 'Open Mat',        type: 'open-mat',  detail: 'All disciplines welcome',   displayTime: '10:00 AM' },
];

const TYPE_CFG: Record<ClassType, { accent: string; bg: string; text: string; label: string; border: string }> = {
  bjj:        { accent: '#2563EB', bg: 'rgba(37,99,235,0.13)',  text: '#93C5FD', label: 'Jiu Jitsu', border: 'rgba(37,99,235,0.35)' },
  mma:        { accent: '#C41E1E', bg: 'rgba(196,30,30,0.14)',  text: '#FCA5A5', label: 'MMA',       border: 'rgba(196,30,30,0.45)' },
  wrestling:  { accent: '#D97706', bg: 'rgba(217,119,6,0.13)',  text: '#FCD34D', label: 'Wrestling', border: 'rgba(217,119,6,0.35)' },
  'open-mat': { accent: '#F5C400', bg: 'rgba(245,196,0,0.10)',  text: '#F5C400', label: 'Open Mat',  border: 'rgba(245,196,0,0.35)' },
  kids:       { accent: '#16A34A', bg: 'rgba(22,163,74,0.12)',  text: '#86EFAC', label: 'Kids',      border: 'rgba(22,163,74,0.35)' },
};

const LEGEND: ClassType[] = ['bjj', 'mma', 'wrestling', 'kids', 'open-mat'];

const ROW_H = 56; // px per 30-min slot

function ClassPill({ block, active }: { block: ClassBlock; active: string | null }) {
  const cfg = TYPE_CFG[block.type];
  const dimmed = active !== null && active !== block.type;
  return (
    <div
      className="absolute inset-x-0 inset-y-0 flex flex-col justify-center px-3 overflow-hidden transition-opacity"
      style={{
        background: cfg.bg,
        borderLeft: `3px solid ${cfg.accent}`,
        opacity: dimmed ? 0.12 : 1,
      }}
    >
      {/* corner glow */}
      <div
        className="absolute top-0 right-0 w-12 h-full pointer-events-none"
        style={{ background: `linear-gradient(to bottom-left, ${cfg.accent}30, transparent 70%)` }}
      />
      <span className="font-heading text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: cfg.accent }}>
        {cfg.label}
      </span>
      <span className="font-display text-lg leading-tight uppercase" style={{ color: cfg.text }}>
        {block.displayTime}
      </span>
      <span className="font-body text-[10px] text-gray-600 leading-tight mt-0.5 hidden sm:block">{block.detail}</span>
    </div>
  );
}

export default function Calendar() {
  const [active, setActive] = useState<string | null>(null);

  const blocksForDay = (day: string) => CLASSES.filter(c => c.day === day);

  // For each day+slot: does a multi-slot block started above cover this row?
  const isCovered = (day: string, slotIdx: number) =>
    CLASSES.some(c => c.day === day && c.startSlot < slotIdx && c.startSlot + c.span > slotIdx);

  const blockStartingAt = (day: string, slotIdx: number) =>
    CLASSES.find(c => c.day === day && c.startSlot === slotIdx);

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

          {/* Legend / filter */}
          <div className="flex flex-wrap gap-x-5 gap-y-3 mt-8 items-center">
            <span className="font-heading text-xs uppercase tracking-widest text-gray-700">Filter:</span>
            {LEGEND.map(t => {
              const cfg = TYPE_CFG[t];
              const isOn = active === t;
              return (
                <button
                  key={t}
                  onClick={() => setActive(isOn ? null : t)}
                  className="flex items-center gap-2 group transition-opacity"
                  style={{ opacity: active && !isOn ? 0.35 : 1 }}
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
        </div>

        <div
          className="h-5 w-full"
          style={{ background: 'linear-gradient(to bottom right, #080808 49%, #131313 50%)' }}
        />
      </section>

      {/* ── TIMETABLE ──────────────────────────────────────────────── */}
      <section className="bg-gym-charcoal py-10 md:py-14 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12" style={{ minWidth: 680 }}>

          {/* Column headers */}
          <div className="flex" style={{ marginLeft: 64 }}>
            {DAYS.map((day, i) => (
              <div
                key={day}
                className="flex-1 px-2 py-3 bg-gym-black relative"
                style={{
                  borderTop: `3px solid ${i === 4 ? '#F5C400' : '#C41E1E'}`,
                  marginLeft: i > 0 ? 2 : 0,
                }}
              >
                <div className="font-display text-2xl md:text-3xl leading-none text-white uppercase">{DAY_SHORT[i]}</div>
                <div className="font-heading text-[10px] text-gray-700 uppercase tracking-widest mt-0.5 hidden sm:block">{day}</div>
                <div className="absolute top-2.5 right-2 flex gap-1">
                  {blocksForDay(day).map(c => (
                    <span
                      key={c.name}
                      className="w-1 h-1 rounded-full"
                      style={{ background: TYPE_CFG[c.type].accent }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="flex mt-0.5">
            {/* Time axis */}
            <div className="shrink-0" style={{ width: 64 }}>
              {EVE_SLOTS.map((slot, i) => (
                <div
                  key={slot}
                  className="flex items-start justify-end pr-3"
                  style={{ height: ROW_H, paddingTop: 6 }}
                >
                  <span className="font-heading text-[10px] text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    {slot}
                  </span>
                </div>
              ))}
              {/* Saturday label at the bottom */}
              <div className="flex items-center justify-end pr-3 pt-3 border-t border-gym-charcoal-light mt-0.5">
                <span className="font-heading text-[10px] text-bee-yellow/60 uppercase tracking-wider">AM</span>
              </div>
            </div>

            {/* Day columns */}
            <div className="flex flex-1 gap-0.5">
              {DAYS.map(day => (
                <div key={day} className="flex-1 relative" style={{ marginLeft: 2 }}>
                  {EVE_SLOTS.map((_, slotIdx) => {
                    if (isCovered(day, slotIdx)) return null;
                    const block = blockStartingAt(day, slotIdx);
                    const spanHeight = block ? block.span * ROW_H + (block.span - 1) * 2 : ROW_H;

                    return (
                      <div
                        key={slotIdx}
                        className="relative"
                        style={{
                          height: spanHeight,
                          marginBottom: 2,
                          background: '#080808',
                          borderLeft: block ? `3px solid ${TYPE_CFG[block.type].accent}` : '3px solid #1E1E1E',
                        }}
                      >
                        {block && <ClassPill block={block} active={active} />}
                      </div>
                    );
                  })}

                  {/* Saturday morning slot — shown below the evening grid */}
                  {day === 'Saturday' && (() => {
                    const satBlock = CLASSES.find(c => c.day === 'Saturday');
                    const cfg = satBlock ? TYPE_CFG[satBlock.type] : null;
                    const dimmed = active !== null && satBlock && active !== satBlock.type;
                    return (
                      <div
                        className="relative mt-0.5"
                        style={{
                          height: satBlock ? satBlock.span * ROW_H + (satBlock.span - 1) * 2 : ROW_H,
                          background: '#080808',
                          borderLeft: cfg ? `3px solid ${cfg.accent}` : '3px solid #2A2A2A',
                          borderTop: '1px solid #2A2A2A',
                        }}
                      >
                        {satBlock && cfg && (
                          <div
                            className="absolute inset-0 flex flex-col justify-center px-3 overflow-hidden transition-opacity"
                            style={{ background: cfg.bg, opacity: dimmed ? 0.12 : 1 }}
                          >
                            <div
                              className="absolute top-0 right-0 w-12 h-full pointer-events-none"
                              style={{ background: `linear-gradient(to bottom-left, ${cfg.accent}30, transparent 70%)` }}
                            />
                            <span className="font-heading text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: cfg.accent }}>
                              {cfg.label}
                            </span>
                            <span className="font-display text-lg leading-tight uppercase" style={{ color: cfg.text }}>
                              {satBlock.displayTime}
                            </span>
                            <span className="font-body text-[10px] text-gray-600 mt-0.5 hidden sm:block">{satBlock.detail}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom rule */}
          <div className="mt-0.5 h-0.5 bg-gym-charcoal-light" style={{ marginLeft: 64 }} />
        </div>
      </section>

      {/* ── STATS + CONTACT STRIP ───────────────────────────────────── */}
      <section className="bg-gym-black border-t border-gym-charcoal-light">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">

            {/* Discipline counts */}
            <div className="flex flex-wrap gap-5">
              {LEGEND.map(t => {
                const cfg = TYPE_CFG[t];
                const count = CLASSES.filter(c => c.type === t).length * 2;
                if (!count) return null;
                return (
                  <div key={t} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 flex items-center justify-center font-display text-xl"
                      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}
                    >
                      {count}
                    </div>
                    <div>
                      <div className="font-heading text-xs uppercase tracking-widest" style={{ color: cfg.text }}>{cfg.label}</div>
                      <div className="font-body text-[10px] text-gray-700">classes / week</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Phone */}
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

          <p className="font-body text-gray-800 text-xs mt-6 max-w-lg">
            Schedule is a placeholder and will be updated. Contact the gym to confirm current class times.
          </p>
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
