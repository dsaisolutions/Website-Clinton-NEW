import ScheduleCard from '../components/ScheduleCard';
import CTASection from '../components/CTASection';

const schedule = [
  {
    day: 'Monday',
    classes: [
      { time: '5:00 PM', name: 'Kids Jiu Jitsu', type: 'kids' as const },
      { time: '6:00 PM', name: 'Adult Jiu Jitsu', type: 'bjj' as const },
    ],
  },
  {
    day: 'Tuesday',
    classes: [{ time: '6:00 PM', name: 'MMA', type: 'mma' as const }],
  },
  {
    day: 'Wednesday',
    classes: [
      { time: '5:00 PM', name: 'Kids Jiu Jitsu', type: 'kids' as const },
      { time: '6:00 PM', name: 'Adult Jiu Jitsu', type: 'bjj' as const },
    ],
  },
  {
    day: 'Thursday',
    classes: [
      { time: '6:00 PM', name: 'Wrestling', type: 'wrestling' as const },
    ],
  },
  {
    day: 'Saturday',
    classes: [{ time: '10:00 AM', name: 'Open Mat', type: 'open-mat' as const }],
  },
];

const legend = [
  { label: 'Jiu Jitsu', bar: 'bg-blue-600' },
  { label: 'MMA', bar: 'bg-gym-red' },
  { label: 'Wrestling', bar: 'bg-orange-600' },
  { label: 'Kids', bar: 'bg-green-600' },
  { label: 'Open Mat', bar: 'bg-bee-yellow' },
];

export default function Calendar() {
  return (
    <>
      {/* Page header */}
      <section className="relative bg-gym-charcoal overflow-hidden" style={{ paddingTop: 'calc(2rem + 80px + 32px)' }}>
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gym-red" />
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none" aria-hidden="true">
          <span className="font-display text-stroke-yellow opacity-[0.03] leading-none" style={{ fontSize: 'clamp(100px, 18vw, 260px)' }}>
            TRAIN
          </span>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-heading text-gym-red uppercase tracking-widest text-xs font-bold">Class Schedule</span>
            <div className="flex-1 h-px bg-gym-charcoal-light max-w-xs" />
          </div>
          <h1 className="font-display uppercase leading-none text-white" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
            Weekly <span className="text-bee-yellow">Schedule</span>
          </h1>
          <p className="font-body text-gray-400 text-lg mt-4 max-w-xl">
            Classes run weekly. Contact the gym to confirm current times before you show up.
          </p>
        </div>
        <div className="slash-divider" />
      </section>

      {/* Schedule grid */}
      <section className="bg-gym-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-10">
            {legend.map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span className={`inline-block w-2 h-4 ${l.bar}`} />
                <span className="font-heading text-xs uppercase tracking-wider text-gray-400">{l.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {schedule.map((day) => (
              <ScheduleCard key={day.day} day={day.day} classes={day.classes} />
            ))}
          </div>

          {/* Placeholder callout */}
          <div className="mt-10 flex items-start gap-4 border-l-4 border-bee-yellow bg-gym-charcoal px-6 py-4 max-w-xl">
            <div className="shrink-0 w-1.5 h-1.5 bg-bee-yellow rounded-full mt-1.5" />
            <p className="font-body text-gray-400 text-sm">
              <span className="font-heading text-bee-yellow uppercase tracking-wider text-xs">Note: </span>
              Schedule is a placeholder and will be updated soon. Contact the gym to confirm current class times.
            </p>
          </div>

          {/* Phone CTA strip */}
          <div className="mt-8 border-2 border-gym-charcoal-light hover:border-bee-yellow/40 transition-colors bg-gym-charcoal p-6 max-w-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <p className="font-heading text-white uppercase tracking-wide text-sm">Questions about the schedule?</p>
              <p className="font-body text-gray-500 text-sm mt-0.5">Call us directly.</p>
            </div>
            <a
              href="tel:6019668358"
              className="shrink-0 font-heading text-bee-yellow border-2 border-bee-yellow px-5 py-2.5 text-sm uppercase tracking-widest hover:bg-bee-yellow hover:text-gym-black transition-all"
            >
              601-966-8358
            </a>
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
