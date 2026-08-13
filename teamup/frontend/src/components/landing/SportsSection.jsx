import Button from './Button';

const sports = [
  {
    name: 'Football',
    badge: 'bg-[#65A30D]',
    text: "Ton équipe n'est pas complète ? Trouve les joueurs qu'il te manque.",
    button: 'Voir les matchs de football',
    image: '/img/teamup-football-original.png',
  },
  {
    name: 'Basketball',
    badge: 'bg-[#F97316]',
    text: "Besoin d'un joueur pour compléter ton cinq ? Rejoins la communauté.",
    button: 'Voir les matchs de basketball',
    image: '/img/teamup-basketball-original.png',
  },
];

export default function SportsSection() {
  return (
    <section className="bg-white px-5 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-2">
        {sports.map((sport) => (
          <article key={sport.name} className="group relative min-h-[520px] overflow-hidden rounded-[2rem] bg-[#071417] p-8 text-white shadow-2xl shadow-slate-950/10">
            <img src={sport.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071417] via-[#071417]/45 to-transparent" />
            <div className="relative flex h-full flex-col justify-end">
              <span className={`mb-5 w-fit rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.2em] ${sport.badge}`}>{sport.name}</span>
              <h3 className="max-w-lg text-4xl font-black leading-tight">{sport.text}</h3>
              <Button to="/register" variant="light" className="mt-7 w-fit">
                {sport.button}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
