import SectionTitle from './SectionTitle';

const steps = [
  ['01', 'Crée ton profil', 'Inscris-toi gratuitement, indique ta ville, ton sport et ton niveau.'],
  ['02', 'Trouve ou crée un match', 'Recherche une partie disponible ou organise ton propre match.'],
  ['03', 'Rejoins et joue', 'Réserve ta place, retrouve les participants et rendez-vous sur le terrain.'],
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-[#F8FAFC] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle title="Comment ça marche ?" subtitle="Du canapé au terrain en 3 étapes." />
        <div className="relative mt-16 grid gap-6 lg:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-[#65A30D] via-slate-300 to-[#F97316] lg:block" />
          {steps.map(([number, title, text]) => (
            <article key={number} className="relative rounded-[1.75rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-[#071417] text-2xl font-black text-white ring-8 ring-[#F8FAFC]">{number}</span>
              <h3 className="mt-8 text-2xl font-black text-[#071417]">{title}</h3>
              <p className="mt-3 leading-7 text-[#64748B]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

