import Button from './Button';

interface CTASectionProps {
  headline: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

export default function CTASection({ headline, primaryLabel, primaryTo, secondaryLabel, secondaryTo }: CTASectionProps) {
  return (
    <section className="relative bg-gym-black overflow-hidden border-t-4 border-bee-yellow">
      {/* Large background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span className="font-display text-stroke-yellow opacity-[0.03] leading-none whitespace-nowrap"
          style={{ fontSize: 'clamp(80px, 16vw, 200px)' }}>
          KILLER BEES
        </span>
      </div>

      {/* Repeating diagonal pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, #F5C400 0, #F5C400 1px, transparent 0, transparent 14px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2
              className="font-display uppercase text-bee-yellow leading-none text-shadow-yellow"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
            >
              {headline}
            </h2>
            <div className="mt-3 h-1 w-24 bg-gym-red" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Button to={primaryTo} variant="red" size="lg">{primaryLabel}</Button>
            {secondaryLabel && secondaryTo && (
              <Button to={secondaryTo} variant="outline" size="lg">{secondaryLabel}</Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
