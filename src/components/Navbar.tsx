import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from './Button';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Instructors', to: '/instructors' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <>
      {/* Info bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-bee-yellow h-8 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 overflow-hidden">
            <span className="font-heading text-xs uppercase tracking-widest text-gym-black font-bold whitespace-nowrap">Killer Bees Clinton</span>
            <span className="hidden sm:flex items-center gap-4">
              <span className="inline-block w-1 h-1 bg-gym-red rounded-full" />
              <span className="font-heading text-xs uppercase tracking-wider text-gym-charcoal font-semibold">Jiu Jitsu</span>
              <span className="inline-block w-1 h-1 bg-gym-red rounded-full" />
              <span className="font-heading text-xs uppercase tracking-wider text-gym-charcoal font-semibold">MMA</span>
              <span className="inline-block w-1 h-1 bg-gym-red rounded-full" />
              <span className="font-heading text-xs uppercase tracking-wider text-gym-charcoal font-semibold">Wrestling</span>
            </span>
          </div>
          <a
            href="tel:6019668358"
            className="font-heading text-xs uppercase tracking-widest text-gym-black font-bold hover:text-gym-red transition-colors whitespace-nowrap"
          >
            601-966-8358
          </a>
        </div>
      </div>

      {/* Main nav */}
      <header
        className={`fixed top-8 left-0 right-0 z-40 transition-all duration-200 ${
          scrolled
            ? 'bg-gym-black/98 backdrop-blur-sm border-b-2 border-bee-yellow/40'
            : 'bg-gym-black/70'
        }`}
      >
        {/* Left red accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gym-red" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* Logo — place logo.png in /public/ for this to display */}
            <Link to="/" className="flex items-center gap-0 group shrink-0">
              <div className="h-12 md:h-14 bg-white flex items-center px-2 py-1">
                {/* Replace src with /logo.png once file is in public/ */}
                <img
                  src="/logo.png"
                  alt="Killer Bees Clinton"
                  className="h-full w-auto object-contain max-w-[160px]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                  }}
                />
                {/* Fallback if logo not present */}
                <div className="hidden items-center gap-1 px-1">
                  <div className="font-display text-gym-black leading-none text-sm uppercase">
                    <span className="block">Killer Bees</span>
                  </div>
                </div>
              </div>
              <div className="bg-gym-red px-3 h-12 md:h-14 flex items-center">
                <span className="font-display text-white uppercase tracking-wider text-sm md:text-base leading-none">Clinton</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-heading uppercase tracking-widest text-sm px-5 h-16 md:h-18 flex items-center border-b-4 transition-all duration-150 ${
                    location.pathname === link.to
                      ? 'text-bee-yellow border-bee-yellow'
                      : 'text-gray-300 border-transparent hover:text-bee-yellow hover:border-bee-yellow/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:block">
              <Button to="/contact" variant="primary" size="sm">Start Training</Button>
            </div>

            <button
              className="md:hidden text-white hover:text-bee-yellow transition-colors p-1"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-gym-black border-t-2 border-bee-yellow">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-heading uppercase tracking-widest text-sm px-6 py-4 border-b border-gym-charcoal-light transition-colors flex items-center gap-3 ${
                    location.pathname === link.to
                      ? 'text-bee-yellow bg-gym-charcoal'
                      : 'text-gray-300 hover:text-bee-yellow hover:bg-gym-charcoal'
                  }`}
                >
                  {location.pathname === link.to && (
                    <span className="inline-block w-1.5 h-1.5 bg-bee-yellow rounded-full" />
                  )}
                  {link.label}
                </Link>
              ))}
              <div className="px-6 py-4">
                <Button to="/contact" variant="primary" size="md" className="w-full">Start Training</Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
