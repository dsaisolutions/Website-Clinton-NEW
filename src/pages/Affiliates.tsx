import { Phone, Mail, Globe, MapPin, ExternalLink } from 'lucide-react';
import CTASection from '../components/CTASection';

interface Affiliate {
  schoolName: string;
  logo: string | null;
  contactName: string;
  phone: string;
  email: string;
  website: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  mapUrl: string;
}

// TODO: Replace with real affiliate data when available
const affiliates: Affiliate[] = [];

function AffiliateRow({ affiliate: a }: { affiliate: Affiliate }) {
  const fullAddress = `${a.streetAddress}, ${a.city}, ${a.state} ${a.zip}`;

  return (
    <article className="relative border-2 border-gym-charcoal-light bg-gym-charcoal overflow-hidden">
      {/* Yellow top bar */}
      <div className="h-1 bg-bee-yellow w-full" />

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-8 h-8 bg-bee-yellow z-10"
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
        aria-hidden="true"
      />

      <div className="flex flex-col sm:flex-row gap-0">

        {/* Logo column */}
        <div className="shrink-0 flex items-center justify-center bg-gym-black sm:w-40 p-6 border-b-2 sm:border-b-0 sm:border-r-2 border-gym-charcoal-light">
          {a.logo ? (
            <img
              src={a.logo}
              alt={`${a.schoolName} logo`}
              className="w-20 h-20 object-contain"
            />
          ) : (
            <div
              className="w-20 h-20 border-2 border-gym-charcoal-light flex items-center justify-center"
              aria-label="Logo placeholder"
            >
              <span className="font-display text-2xl text-gray-700 uppercase leading-none text-center px-1">
                {a.schoolName.split(' ').map((w) => w[0]).join('').slice(0, 3)}
              </span>
            </div>
          )}
        </div>

        {/* Info column */}
        <div className="flex-1 p-6 flex flex-col gap-4">

          {/* Name + contact name */}
          <div>
            <h2
              className="font-display uppercase text-white leading-none"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)' }}
            >
              {a.schoolName}
            </h2>
            {a.contactName && (
              <p className="font-heading text-xs uppercase tracking-widest text-gray-500 mt-1">
                Contact: <span className="text-gray-400">{a.contactName}</span>
              </p>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-7 h-7 border border-bee-yellow/30 flex items-center justify-center mt-0.5">
              <MapPin size={13} className="text-bee-yellow" />
            </div>
            <div>
              <p className="font-body text-gray-300 text-sm">{a.streetAddress}</p>
              <p className="font-body text-gray-300 text-sm">{a.city}, {a.state} {a.zip}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mt-1">
            {a.phone && (
              <a
                href={`tel:${a.phone.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-2 font-heading text-xs uppercase tracking-widest border border-gym-charcoal-light text-gray-300 hover:border-bee-yellow hover:text-bee-yellow transition-colors px-4 py-2"
              >
                <Phone size={12} />
                Call
              </a>
            )}
            {a.email && (
              <a
                href={`mailto:${a.email}`}
                className="inline-flex items-center gap-2 font-heading text-xs uppercase tracking-widest border border-gym-charcoal-light text-gray-300 hover:border-bee-yellow hover:text-bee-yellow transition-colors px-4 py-2"
              >
                <Mail size={12} />
                Email
              </a>
            )}
            {a.website && (
              <a
                href={a.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-heading text-xs uppercase tracking-widest border border-gym-charcoal-light text-gray-300 hover:border-bee-yellow hover:text-bee-yellow transition-colors px-4 py-2"
              >
                <Globe size={12} />
                Website
              </a>
            )}
            {a.mapUrl && (
              <a
                href={a.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-heading text-xs uppercase tracking-widest bg-bee-yellow text-gym-black border border-bee-yellow hover:bg-bee-yellow-bright hover:border-bee-yellow-bright transition-colors px-4 py-2"
              >
                <ExternalLink size={12} />
                View Map
              </a>
            )}
          </div>

          {/* Address text for screen readers / copy */}
          <p className="sr-only">{fullAddress}</p>
        </div>
      </div>
    </article>
  );
}

export default function Affiliates() {
  return (
    <>
      {/* ── SEO meta (injected via document title effect) ─────────── */}
      <title>Affiliates — Killer Bees Clinton | Training Schools in the Area</title>

      {/* Page header — matches Instructors / Contact pattern */}
      <section className="relative bg-gym-charcoal overflow-hidden" style={{ paddingTop: 'calc(2rem + 80px + 32px)' }}>
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gym-red" />

        <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none" aria-hidden="true">
          <span className="font-display text-stroke-yellow opacity-[0.03] leading-none" style={{ fontSize: 'clamp(100px, 18vw, 260px)' }}>
            AFFILIATES
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-heading text-gym-red uppercase tracking-widest text-xs font-bold">Network</span>
            <div className="flex-1 h-px bg-gym-charcoal-light max-w-xs" />
          </div>
          <h1
            className="font-display uppercase leading-none text-white"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            <span className="text-bee-yellow">Affiliated</span> Schools
          </h1>
          <p className="font-body text-gray-400 text-lg mt-4 max-w-xl">
            Find affiliated training schools and programs in the area.
          </p>
        </div>
        <div className="slash-divider" />
      </section>

      {/* Listings */}
      <section className="bg-gym-black py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {affiliates.length > 0 ? (
            <div className="flex flex-col gap-5">
              {affiliates.map((a) => (
                <AffiliateRow key={a.schoolName} affiliate={a} />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="border-2 border-dashed border-gym-charcoal-light bg-gym-charcoal flex flex-col items-center justify-center text-center py-20 px-8">
              <div
                className="w-16 h-16 border-2 border-bee-yellow/25 flex items-center justify-center mb-6"
                aria-hidden="true"
              >
                <MapPin size={28} strokeWidth={1} className="text-bee-yellow/30" />
              </div>
              <h2 className="font-display text-3xl uppercase text-white mb-3">
                No Affiliates Listed Yet
              </h2>
              <p className="font-body text-gray-500 text-base max-w-sm">
                Affiliated school listings will appear here once information is confirmed.
                Check back soon or contact the gym for referrals.
              </p>
            </div>
          )}

        </div>
      </section>

      <CTASection
        headline="Ready to Step on the Mat?"
        primaryLabel="Contact the Gym"
        primaryTo="/contact"
        secondaryLabel="View Schedule"
        secondaryTo="/calendar"
      />
    </>
  );
}
