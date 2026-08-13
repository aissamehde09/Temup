import { MapPin, Star, Trophy, Users } from './icons';

const stats = [
  [Users, '10K+', 'Joueurs inscrits'],
  [Trophy, '5K+', 'Matchs organisés'],
  [MapPin, '150+', 'Villes'],
  [Star, '4.8/5', 'Note moyenne'],
];

export default function Stats() {
  return (
    <section className="bg-[#071417] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([Icon, value, label], index) => (
          <div key={label} className="flex items-center gap-5 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
            <div className={`grid h-14 w-14 place-items-center rounded-2xl ${index % 2 ? 'bg-orange-500/15 text-[#F97316]' : 'bg-lime-500/15 text-[#65A30D]'}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-4xl font-black">{value}</p>
              <p className="mt-1 text-sm text-white/55">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
