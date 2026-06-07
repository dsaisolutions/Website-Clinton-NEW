import { useState } from 'react';
import { MapPin, Phone, Send } from 'lucide-react';
import Button from '../components/Button';

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputCls =
    'w-full bg-gym-charcoal-mid border-b-2 border-gym-charcoal-light focus:border-bee-yellow outline-none px-0 py-3 font-body text-white text-base placeholder-gray-600 transition-colors bg-transparent';

  return (
    <>
      {/* Page header */}
      <section className="relative bg-gym-charcoal overflow-hidden" style={{ paddingTop: 'calc(2rem + 80px + 32px)' }}>
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gym-red" />
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none" aria-hidden="true">
          <span className="font-display text-stroke-yellow opacity-[0.03] leading-none" style={{ fontSize: 'clamp(100px, 18vw, 260px)' }}>
            CONTACT
          </span>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-heading text-gym-red uppercase tracking-widest text-xs font-bold">Get In Touch</span>
            <div className="flex-1 h-px bg-gym-charcoal-light max-w-xs" />
          </div>
          <h1 className="font-display uppercase leading-none text-white" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
            Contact <span className="text-bee-yellow">the Gym</span>
          </h1>
          <p className="font-body text-gray-400 text-lg mt-4 max-w-xl">
            Have a question or ready to start training? Send a message and we'll get back with you.
          </p>
        </div>
        <div className="slash-divider" />
      </section>

      {/* Main content */}
      <section className="bg-gym-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Info panel */}
            <div className="flex flex-col gap-8">

              {/* Gym card */}
              <div className="relative border-2 border-gym-charcoal-light bg-gym-charcoal overflow-hidden clip-corner-tr">
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-6 h-6 bg-bee-yellow" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />

                <div className="p-8">
                  <div className="mb-6">
                    {/* Logo in gym card */}
                    <div className="bg-white inline-flex flex-col overflow-hidden mb-4">
                      <img
                        src="/logo.png"
                        alt="Killer Bees Clinton"
                        className="h-16 w-auto"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="bg-gym-red py-1 px-2 flex items-center justify-center">
                        <span className="font-display text-white uppercase tracking-[0.3em] text-xs">Clinton</span>
                      </div>
                    </div>
                    <p className="font-heading text-xs uppercase tracking-[0.2em] text-gray-500">
                      Jiu Jitsu &bull; MMA &bull; Wrestling
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-8 h-8 border-2 border-bee-yellow/40 flex items-center justify-center">
                        <MapPin size={14} className="text-bee-yellow" />
                      </div>
                      <div>
                        <p className="font-heading text-xs uppercase tracking-wider text-gray-500 mb-1">Address</p>
                        <p className="font-body text-white text-sm">408 Cynthia St</p>
                        <p className="font-body text-white text-sm">Clinton, Mississippi 39056</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-8 h-8 border-2 border-bee-yellow/40 flex items-center justify-center">
                        <Phone size={14} className="text-bee-yellow" />
                      </div>
                      <div>
                        <p className="font-heading text-xs uppercase tracking-wider text-gray-500 mb-1">Phone</p>
                        <a href="tel:6019668358" className="font-body text-white text-sm hover:text-bee-yellow transition-colors">
                          601-966-8358
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="border-2 border-gym-charcoal-light overflow-hidden">
                <iframe
                  title="Killer Bees Clinton location"
                  src="https://www.google.com/maps?q=408+Cynthia+St,+Clinton,+MS+39056&output=embed"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=408+Cynthia+St+Clinton+MS+39056"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gym-charcoal border-t-2 border-gym-charcoal-light py-3 font-heading text-xs uppercase tracking-widest text-gray-400 hover:text-bee-yellow hover:border-bee-yellow transition-colors"
                >
                  <MapPin size={13} />
                  Get Directions — Killer Bees Clinton
                </a>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="font-display text-4xl uppercase text-white leading-none mb-2">Send a Message</h2>
              <div className="h-1 w-16 bg-gym-red mb-8" />

              {submitted ? (
                <div className="border-2 border-bee-yellow bg-bee-yellow/8 p-10 text-center">
                  <div className="font-display text-4xl text-bee-yellow uppercase mb-3">Message Sent</div>
                  <p className="font-body text-gray-300 text-base">We'll be in touch soon.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                    className="mt-6 font-heading text-xs uppercase tracking-widest text-gray-500 hover:text-bee-yellow transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Name <span className="text-gym-red">*</span>
                    </label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Email <span className="text-gym-red">*</span>
                    </label>
                    <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(601) 000-0000" className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Message <span className="text-gym-red">*</span>
                    </label>
                    <textarea name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Questions about classes, schedule, or anything else." className={`${inputCls} resize-none`} />
                  </div>
                  <Button type="submit" variant="primary" size="lg" className="flex items-center justify-center gap-2 w-full mt-2">
                    <Send size={16} />
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
