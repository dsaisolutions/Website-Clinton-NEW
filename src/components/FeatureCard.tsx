import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: boolean;
}

export default function FeatureCard({ icon: Icon, title, description, accent = false }: FeatureCardProps) {
  return (
    <div
      className={`relative group border-2 p-6 md:p-8 transition-all duration-200 cursor-default ${
        accent
          ? 'bg-bee-yellow border-bee-yellow hover:bg-bee-yellow-bright'
          : 'bg-gym-charcoal border-gym-charcoal-light hover:border-bee-yellow/60 hover:-translate-y-1'
      }`}
      style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)' }}
    >
      <div
        className={`absolute top-0 right-0 w-4 h-4 ${accent ? 'bg-bee-yellow-dark' : 'bg-bee-yellow'}`}
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      />
      <div className={`mb-4 ${accent ? 'text-gym-black' : 'text-bee-yellow'}`}>
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className={`font-display text-2xl uppercase mb-2 leading-none ${accent ? 'text-gym-black' : 'text-white'}`}>
        {title}
      </h3>
      <p className={`font-body text-sm leading-relaxed ${accent ? 'text-gym-charcoal' : 'text-gray-400'}`}>
        {description}
      </p>
    </div>
  );
}
