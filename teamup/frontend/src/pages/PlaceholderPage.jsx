export default function PlaceholderPage({ title }) {
  return (
    <div className="rounded-[2rem] bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-black">{title}</h1>
      <p className="mt-2 text-slate-500">Cette section est prête dans la navigation et peut être enrichie ensuite.</p>
    </div>
  );
}

