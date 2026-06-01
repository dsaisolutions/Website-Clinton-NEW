import InstructorCard from '../components/InstructorCard';
import CTASection from '../components/CTASection';
import Button from '../components/Button';

const instructors = [
  {
    name: 'Head Instructor',
    role: 'Head Instructor',
    bio: 'Instructor bio coming soon. Leads the program with years of competition and coaching experience across all disciplines.',
    specialties: ['Jiu Jitsu', 'MMA'],
  },
  {
    name: 'Assistant Instructor',
    role: 'Assistant Instructor',
    bio: 'Instructor bio coming soon. Focuses on building strong fundamentals in new students and running the kids program.',
    specialties: ['Fundamentals', 'Kids Classes'],
  },
  {
    name: 'MMA Coach',
    role: 'MMA Coach',
    bio: 'Instructor bio coming soon. Brings together striking, wrestling, and grappling into effective game plans for competition.',
    specialties: ['MMA', 'Striking'],
  },
  {
    name: 'Wrestling Coach',
    role: 'Wrestling Coach',
    bio: 'Instructor bio coming soon. Specializes in takedowns, scrambles, and building the physical conditioning that wrestling demands.',
    specialties: ['Wrestling', 'Competition Prep'],
  },
];

export default function Instructors() {
  return (
    <>
      {/* Page header */}
      <section className="relative bg-gym-charcoal overflow-hidden" style={{ paddingTop: 'calc(2rem + 80px + 32px)' }}>
        {/* Left red accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gym-red" />

        {/* Big watermark */}
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none" aria-hidden="true">
          <span className="font-display text-stroke-yellow opacity-[0.03] leading-none" style={{ fontSize: 'clamp(100px, 18vw, 260px)' }}>
            TEAM
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-heading text-gym-red uppercase tracking-widest text-xs font-bold">The Team</span>
            <div className="flex-1 h-px bg-gym-charcoal-light max-w-xs" />
          </div>
          <h1
            className="font-display uppercase leading-none text-white"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            Meet the <span className="text-bee-yellow">Instructors</span>
          </h1>
          <p className="font-body text-gray-400 text-lg mt-4 max-w-xl">
            Placeholder profiles — names, photos, and bios will be updated as information is confirmed.
          </p>
        </div>
        <div className="slash-divider" />
      </section>

      {/* Cards */}
      <section className="bg-gym-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {instructors.map((inst) => (
              <InstructorCard key={inst.role} {...inst} />
            ))}
          </div>

          <div className="mt-10 flex items-start gap-4 border-l-4 border-bee-yellow bg-gym-charcoal px-6 py-4 max-w-xl">
            <div className="shrink-0 w-1.5 h-1.5 bg-bee-yellow rounded-full mt-1.5" />
            <p className="font-body text-gray-400 text-sm">
              <span className="font-heading text-bee-yellow uppercase tracking-wider text-xs">Note: </span>
              All instructor cards are placeholders. Real names, photos, and bios will be added when available.
            </p>
          </div>

          <div className="mt-8">
            <Button to="/contact" variant="primary">Contact the Gym</Button>
          </div>
        </div>
      </section>

      <CTASection
        headline="Train Under Real Coaches"
        primaryLabel="Contact the Gym"
        primaryTo="/contact"
        secondaryLabel="View Schedule"
        secondaryTo="/calendar"
      />
    </>
  );
}
