export default function SectionTitle({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <div className={`mx-auto max-w-3xl ${align === 'center' ? 'text-center' : 'text-left'}`}>
      {eyebrow && <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-[#65A30D]">{eyebrow}</p>}
      <h2 className="text-3xl font-black tracking-tight text-[#071417] md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg leading-8 text-[#64748B]">{subtitle}</p>}
    </div>
  );
}

