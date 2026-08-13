import Button from './Button';

export default function FinalCTA() {
  return (
    <section className="bg-white px-5 pb-24 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#071417] px-8 py-20 text-center text-white shadow-2xl shadow-slate-950/20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-black tracking-tight md:text-6xl">Ton prochain match commence ici.</h2>
          <p className="mt-6 text-lg leading-8 text-white/65">
            Rejoins TeamUp, trouve des joueurs près de chez toi et passe enfin du groupe WhatsApp au terrain.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button to="/register">Créer mon compte gratuitement</Button>
            <Button to="/" variant="secondary">Retour à l’accueil</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
