interface SectionTitleProps {
  label?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionTitle({
  label,
  title,
  titleHighlight,
  subtitle,
  align = 'left',
}: SectionTitleProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-2 mb-10 ${alignClass}`}>
      {label && (
        <span className="font-heading text-sm uppercase tracking-[0.25em] text-gym-red font-semibold flex items-center gap-2">
          <span className="inline-block w-8 h-0.5 bg-gym-red" />
          {label}
        </span>
      )}
      <h2 className="font-display text-5xl md:text-6xl uppercase leading-none text-white">
        {title}
        {titleHighlight && <span className="text-bee-yellow"> {titleHighlight}</span>}
      </h2>
      {subtitle && (
        <p className="font-body text-base md:text-lg max-w-2xl text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}
