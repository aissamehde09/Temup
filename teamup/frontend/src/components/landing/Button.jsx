import { Link } from 'react-router-dom';
import { ArrowRight } from './icons';

export default function Button({ children, to, variant = 'primary', withArrow = false, className = '' }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition duration-300 focus:outline-none focus:ring-4 focus:ring-lime-500/30';
  const variants = {
    primary: 'bg-[#65A30D] text-white shadow-lg shadow-lime-900/20 hover:-translate-y-0.5 hover:bg-[#4d7c0f]',
    secondary: 'border border-white/15 bg-white/10 text-white backdrop-blur hover:-translate-y-0.5 hover:bg-white/15',
    light: 'bg-white text-[#071417] shadow-lg shadow-slate-950/10 hover:-translate-y-0.5 hover:bg-slate-50',
    outline: 'border border-slate-200 bg-white text-[#071417] hover:-translate-y-0.5 hover:border-[#65A30D] hover:text-[#14532D]',
  };
  const content = (
    <>
      {children}
      {withArrow && <ArrowRight size={17} strokeWidth={2.5} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
        {content}
      </Link>
    );
  }

  return <button className={`${base} ${variants[variant]} ${className}`}>{content}</button>;
}
