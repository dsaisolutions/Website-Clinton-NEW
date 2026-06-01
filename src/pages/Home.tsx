import { MapPin } from 'lucide-react';
import Button from '../components/Button';
import CTASection from '../components/CTASection';
import bearImg from '../assets/bw_bear.png';

const disciplines = [
  {
    num: '01',
    title: 'Jiu Jitsu',
    desc: 'Ground game built on control, leverage, and submission. Learn to dominate from any position — standing, on top, or off your back.',
    detail: 'Gi & No-Gi / All Levels',
  },
  {
    num: '02',
    title: 'MMA',
    desc: 'Striking, wrestling, and grappling unified into one complete combat system. Train the way fighters actually compete.',
    detail: 'Striking / Takedowns / Ground',
  },
  {
    num: '03',
    title: 'Wrestling',
    desc: 'Takedowns, scrambles, and top control. The hardest working discipline in the room — and the one that wins fights.',
    detail: 'Folkstyle / Freestyle / Greco',
  },
];

const pillars = [
  { label: 'Real Coaching', desc: 'Not just technique — strategy, mindset, and accountability.' },
  { label: 'Hard Work', desc: 'The mat does not lie. You get what you put in.' },
  { label: 'Discipline', desc: 'Show up consistently and you will not recognize yourself in a year.' },
  { label: 'Community', desc: 'Train with people who push you and have your back.' },
  { label: 'Beginner Friendly', desc: 'No experience needed. Everyone starts at zero.' },
  { label: 'Competition Ready', desc: 'Fundamentals built for the real thing.' },
];

export default function Home() {
  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-gym-black overflow-hidden flex flex-col justify-end">

        {/* Giant background text watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-display text-stroke-yellow opacity-[0.04] leading-none whitespace-nowrap"
            style={{ fontSize: 'clamp(140px, 22vw, 320px)' }}
          >
            CLINTON
          </span>
        </div>

        {/* Diagonal slash across hero */}
        <div
          className="absolute top-0 right-0 w-2/5 h-full pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, #131313 0%, #1E1E1E 100%)',
            clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0% 100%)',
          }}
        />

        {/* Red vertical stripe */}
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gym-red" />

        {/* Yellow diagonal slash accent */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0,
            right: '38%',
            bottom: 0,
            width: '6px',
            background: '#F5C400',
            transform: 'skewX(-4deg)',
          }}
        />

        {/* Main content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-0 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-end">

            {/* Left: headline */}
            <div className="lg:col-span-7 pb-16 lg:pb-20">

              {/* Location stamp */}
              <div className="inline-flex items-center gap-0 mb-8 overflow-hidden">
                <div className="bg-gym-red px-4 py-1.5">
                  <span className="font-heading text-white text-xs uppercase tracking-[0.3em] font-bold">Clinton, MS</span>
                </div>
                <div className="bg-bee-yellow px-4 py-1.5">
                  <span className="font-heading text-gym-black text-xs uppercase tracking-[0.3em] font-bold flex items-center gap-2">
                    <MapPin size={10} />
                    Jiu Jitsu · MMA · Wrestling
                  </span>
                </div>
              </div>

              {/* Headline stack */}
              <div className="mb-8">
                <div
                  className="font-display uppercase leading-none text-white text-shadow-hard block"
                  style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)' }}
                >
                  Train Hard.
                </div>
                <div
                  className="font-display uppercase leading-none text-bee-yellow text-shadow-yellow block"
                  style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)' }}
                >
                  Stay Sharp.
                </div>
                <div
                  className="font-display uppercase leading-none text-white text-shadow-hard block"
                  style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)' }}
                >
                  Join the Hive.
                </div>
              </div>

              <p className="font-body text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mb-10">
                Jiu Jitsu, MMA, and Wrestling in Clinton, Mississippi.
                All levels. Real coaching. No shortcuts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button to="/calendar" variant="primary" size="lg">View Schedule</Button>
                <Button to="/contact" variant="outline" size="lg">Contact Us</Button>
              </div>
            </div>

            {/* Right: bear mascot panel */}
            <div className="hidden lg:flex lg:col-span-5 justify-center items-end pb-0 pl-8">
              <div className="relative w-full max-w-xs">

                {/* Outer yellow frame with angular cut */}
                <div
                  className="relative border-4 border-gym-black overflow-hidden"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)' }}
                >
                  {/* Red top stripe */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gym-red z-10" />

                  {/* Dark bg so bear stays crisp; yellow tint only from the frame */}
                  <div className="bg-gym-black relative">
                    <img
                      src={bearImg}
                      alt="Killer Bees Clinton mascot"
                      className="w-full h-auto block"
                      style={{
                        filter: 'contrast(1.15) brightness(1.05)',
                        display: 'block',
                      }}
                    />

                    {/* Subtle yellow vignette bottom — ties it to the brand without washing it out */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to top, rgba(245,196,0,0.12) 0%, transparent 100%)',
                      }}
                    />
                  </div>

                  {/* CLINTON nameplate */}
                  <div className="bg-gym-black py-3 px-4 flex items-center justify-between gap-3">
                    <div className="h-px flex-1 bg-bee-yellow/40" />
                    <span className="font-display text-bee-yellow uppercase tracking-[0.45em] text-2xl leading-none">
                      Clinton
                    </span>
                    <div className="h-px flex-1 bg-bee-yellow/40" />
                  </div>
                </div>

                {/* Corner bolts — site's angular language */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gym-red" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-bee-yellow" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-bee-yellow" />

                {/* Discipline tags below panel */}
                <div className="mt-4 flex flex-col gap-1.5">
                  {['Jiu Jitsu', 'MMA', 'Wrestling'].map((d) => (
                    <div key={d} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-bee-yellow shrink-0" />
                      <span className="font-heading text-xs uppercase tracking-widest text-gray-400">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scoreboard bar */}
        <div className="relative bg-bee-yellow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-2">
              <div className="flex items-center gap-6 divide-x divide-bee-yellow-dark">
                {['Jiu Jitsu', 'MMA', 'Wrestling'].map((d) => (
                  <span key={d} className="font-heading text-gym-black uppercase font-bold tracking-widest text-sm first:pl-0 pl-6">
                    {d}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-gym-red rounded-full" />
                <span className="font-heading text-gym-black uppercase font-bold tracking-widest text-xs">
                  408 Cynthia St, Clinton MS · 601-966-8358
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHO WE ARE ───────────────────────────────────────────────── */}
      <section className="bg-gym-charcoal hex-bg relative">
        {/* Top red accent line */}
        <div className="h-1 bg-gym-red" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Left: big pull quote */}
            <div className="border-r-0 lg:border-r-4 border-bee-yellow pr-0 lg:pr-16 pb-12 lg:pb-0">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-bee-yellow/30" />
                <span className="font-heading text-gym-red uppercase tracking-widest text-xs font-bold">Who We Are</span>
                <div className="h-px flex-1 bg-bee-yellow/30" />
              </div>

              <h2
                className="font-display uppercase text-bee-yellow leading-none mb-8 text-shadow-yellow"
                style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
              >
                A Gym Built on Real Work
              </h2>

              {/* Big quote mark */}
              <div className="font-display text-8xl text-bee-yellow/20 leading-none -mb-4">"</div>
              <blockquote className="font-body text-gray-200 text-xl md:text-2xl leading-relaxed italic font-light pl-4 border-l-4 border-bee-yellow">
                Show up. Train hard. Get better. No shortcuts. No fluff.
              </blockquote>
            </div>

            {/* Right: body copy */}
            <div className="pl-0 lg:pl-16 pt-12 lg:pt-0">
              <div className="space-y-5 font-body text-gray-300 text-base md:text-lg leading-relaxed">
                <p>
                  Killer Bees Clinton is a martial arts gym in Clinton, Mississippi. We train Jiu Jitsu, MMA, and Wrestling — disciplines that build real skill, real toughness, and real confidence.
                </p>
                <p>
                  This gym is for people who want to put in the work. Brand new? Welcome. Coming back after time off? Welcome. Looking to sharpen your game and compete? You're in the right place.
                </p>
                <p>
                  It's a straightforward deal. You show up, we coach you hard, and you leave better than you came in.
                </p>
              </div>

              {/* Stats strip */}
              <div className="mt-10 grid grid-cols-3 gap-0 border-2 border-gym-charcoal-light">
                {[
                  { val: 'BJJ', label: 'Jiu Jitsu' },
                  { val: 'MMA', label: 'Mixed Martial Arts' },
                  { val: 'WR', label: 'Wrestling' },
                ].map((s, i) => (
                  <div
                    key={s.val}
                    className={`flex flex-col items-center justify-center py-6 ${
                      i < 2 ? 'border-r-2 border-gym-charcoal-light' : ''
                    } hover:bg-bee-yellow/5 transition-colors`}
                  >
                    <span className="font-display text-3xl text-bee-yellow leading-none">{s.val}</span>
                    <span className="font-heading text-gray-500 text-xs uppercase tracking-wider mt-1">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <Button to="/contact" variant="primary">Get Started</Button>
                <Button to="/instructors" variant="outline">Meet the Team</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom slash bar */}
        <div className="slash-divider" />
      </section>

      {/* ─── DISCIPLINES ──────────────────────────────────────────────── */}
      <section className="bg-gym-black py-0 relative overflow-hidden">
        {/* Section label */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
          <div className="flex items-center gap-4 mb-0">
            <span className="font-heading text-gym-red uppercase tracking-[0.3em] text-sm font-bold">What We Train</span>
            <div className="flex-1 h-px bg-gym-charcoal-light" />
          </div>
        </div>

        {/* Discipline rows */}
        {disciplines.map((d, i) => (
          <div
            key={d.num}
            className={`group relative border-b border-gym-charcoal-light hover:border-bee-yellow/30 transition-colors cursor-default ${
              i % 2 === 0 ? 'bg-gym-black' : 'bg-gym-charcoal'
            }`}
          >
            {/* Yellow left border on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-bee-yellow transition-colors" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
              <div className="grid grid-cols-12 gap-6 items-center">
                {/* Number */}
                <div className="col-span-2 md:col-span-1">
                  <span
                    className="font-display text-stroke-yellow opacity-30 group-hover:opacity-60 transition-opacity leading-none block"
                    style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
                  >
                    {d.num}
                  </span>
                </div>

                {/* Title */}
                <div className="col-span-10 md:col-span-3">
                  <h3
                    className="font-display uppercase text-white group-hover:text-bee-yellow transition-colors leading-none"
                    style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
                  >
                    {d.title}
                  </h3>
                  <span className="font-heading text-bee-yellow/60 text-xs uppercase tracking-widest mt-1 block">{d.detail}</span>
                </div>

                {/* Divider */}
                <div className="hidden md:block md:col-span-1">
                  <div className="w-px h-16 bg-bee-yellow/20 mx-auto group-hover:bg-bee-yellow/50 transition-colors" />
                </div>

                {/* Description */}
                <div className="col-span-12 md:col-span-7">
                  <p className="font-body text-gray-400 group-hover:text-gray-200 text-base md:text-lg leading-relaxed transition-colors">
                    {d.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="h-20 md:h-28" />
      </section>

      {/* ─── WHY TRAIN WITH KILLER BEES ───────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Split background */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 bottom-0 w-full lg:w-1/2 bg-bee-yellow" />
          <div className="absolute right-0 top-0 bottom-0 hidden lg:block w-1/2 bg-gym-charcoal" />
        </div>

        {/* Diagonal cut at split */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-24 -ml-12 hidden lg:block"
          style={{ background: 'linear-gradient(to right, #F5C400 50%, #1E1E1E 50%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left: headline (on yellow) */}
            <div className="flex flex-col justify-center">
              <span className="font-heading text-gym-red uppercase tracking-widest text-sm font-bold mb-4 flex items-center gap-2">
                <span className="inline-block w-6 h-0.5 bg-gym-red" />
                Why Train Here
              </span>
              <h2
                className="font-display uppercase leading-none mb-6"
                style={{
                  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                  color: '#080808',
                  WebkitTextStroke: '0',
                  textShadow: '3px 3px 0px rgba(0,0,0,0.25)',
                }}
              >
                Why Train With<br />
                <span style={{ color: '#8B0000' }}>Killer Bees</span>
              </h2>
              <p className="font-body text-gym-charcoal-mid text-lg leading-relaxed max-w-sm font-medium">
                This is what you get when you walk through the door.
              </p>
              <div className="mt-8">
                <Button to="/contact" variant="red" size="lg">Start Today</Button>
              </div>
            </div>

            {/* Right: pillars (on dark) */}
            <div className="grid grid-cols-1 gap-0">
              {pillars.map((p, i) => (
                <div
                  key={p.label}
                  className={`group flex gap-4 items-start py-5 px-6 border-b border-gym-charcoal-light/60 hover:bg-bee-yellow/5 transition-colors ${
                    i === 0 ? 'border-t border-gym-charcoal-light/60' : ''
                  }`}
                >
                  <span className="font-display text-bee-yellow text-2xl leading-none shrink-0 mt-0.5 group-hover:text-bee-yellow-bright transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="font-heading text-white uppercase tracking-wider text-base group-hover:text-bee-yellow transition-colors">
                      {p.label}
                    </div>
                    <div className="font-body text-gray-500 text-sm mt-0.5">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────────────── */}
      <CTASection
        headline="Ready to Step on the Mat?"
        primaryLabel="Contact the Gym"
        primaryTo="/contact"
        secondaryLabel="See Class Calendar"
        secondaryTo="/calendar"
      />
    </>
  );
}
