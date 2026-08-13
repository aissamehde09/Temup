import { CalendarPlus, MessageCircle, ShieldCheck, Users } from './icons';
import SectionTitle from './SectionTitle';

const features = [
  [Users, 'Trouve des joueurs', 'Rencontre des sportifs proches de chez toi selon ton sport, ton niveau et tes disponibilités.'],
  [CalendarPlus, 'Organise facilement', 'Crée ton match en quelques clics et définis le lieu, la date, le niveau et le nombre de joueurs.'],
  [MessageCircle, 'Reste connecté', 'Retrouve les informations de tes matchs et échange facilement avec les participants.'],
  [ShieldCheck, 'Une communauté fiable', 'Des profils sportifs et un système pensé pour créer des rencontres dans de bonnes conditions.'],
];

export default function Features() {
  return (
    <section id="about" className="bg-white px-5 pb-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle title="Tout ce qu'il te faut pour jouer" />
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map(([Icon, title, text], index) => (
            <article key={title} className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/5">
              <div className={`grid h-14 w-14 place-items-center rounded-2xl ${index === 1 ? 'bg-orange-50 text-[#F97316]' : 'bg-lime-50 text-[#65A30D]'}`}>
                <Icon size={25} />
              </div>
              <h3 className="mt-6 text-xl font-black text-[#071417]">{title}</h3>
              <p className="mt-3 leading-7 text-[#64748B]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
