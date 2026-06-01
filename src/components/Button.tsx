import { Link } from 'react-router-dom';

interface ButtonProps {
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'red';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
}

export default function Button({
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  type = 'button',
}: ButtonProps) {
  const base =
    'inline-block font-heading font-bold uppercase tracking-widest transition-all duration-150 border-2 cursor-pointer select-none text-center';

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variants = {
    primary:
      'bg-bee-yellow text-gym-black border-bee-yellow hover:bg-bee-yellow-bright hover:border-bee-yellow-bright hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#C9A000]',
    outline:
      'bg-transparent text-bee-yellow border-bee-yellow hover:bg-bee-yellow hover:text-gym-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#C9A000]',
    red: 'bg-gym-red text-white border-gym-red hover:bg-gym-red-dark hover:border-gym-red-dark hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#6b0f0f]',
  };

  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button type={type} onClick={onClick} className={cls}>{children}</button>;
}
