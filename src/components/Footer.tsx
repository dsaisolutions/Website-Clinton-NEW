import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Instructors', to: '/instructors' },
  { label: 'Class Calendar', to: '/calendar' },
  { label: 'Contact Us', to: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-gym-charcoal border-t-4 border-bee-yellow relative overflow-hidden">
      {/* Watermark text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.045]" aria-hidden="true">
        <span
          className="font-display text-bee-yellow leading-none whitespace-nowrap"
          style={{ fontSize: 'clamp(80px, 12vw, 180px)', letterSpacing: '0.08em' }}
        >
          KILLER BEES
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            {/* Logo — same white bg treatment */}
            <div className="bg-white inline-flex flex-col w-40 overflow-hidden">
              <img
                src="/logo.png"
                alt="Killer Bees Clinton"
                className="w-full h-auto"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="bg-gym-red py-1 flex items-center justify-center">
                <span className="font-display text-white uppercase tracking-[0.4em] text-sm">Clinton</span>
              </div>
            </div>
            <p className="font-heading text-gray-500 text-xs uppercase tracking-wider mt-2">
              Jiu Jitsu &bull; MMA &bull; Wrestling<br />Clinton, Mississippi
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading text-bee-yellow uppercase tracking-widest text-xs mb-5 flex items-center gap-2">
              <span className="inline-block w-4 h-0.5 bg-bee-yellow" /> Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="font-body text-gray-400 hover:text-bee-yellow transition-colors text-sm uppercase tracking-wide">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-bee-yellow uppercase tracking-widest text-xs mb-5 flex items-center gap-2">
              <span className="inline-block w-4 h-0.5 bg-bee-yellow" /> Find Us
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin size={14} className="text-bee-yellow mt-0.5 shrink-0" />
                <span className="font-body">408 Cynthia St<br />Clinton, Mississippi 39056</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={14} className="text-bee-yellow shrink-0" />
                <a href="tel:6019668358" className="font-body hover:text-bee-yellow transition-colors">601-966-8358</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gym-charcoal-light flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs font-body uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Killer Bees Clinton. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs font-body uppercase tracking-wider">Clinton, Mississippi</p>
        </div>
      </div>
    </footer>
  );
}
