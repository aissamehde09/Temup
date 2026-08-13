import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, PagePanel, PageTitle, SelectInput, TextInput } from '../components/InternalUI';
import { Basketball, Football } from '../components/landing/icons';
import { useAuth } from '../context/AuthContext';
import { useMatchData } from '../context/MatchDataContext';
import { getErrorMessage } from '../services/api';

export default function CreateMatchPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createMatch } = useMatchData();
  const [sport, setSport] = useState('Football');
  const [players, setPlayers] = useState(10);
  const [form, setForm] = useState({ title: '', city: 'Nanterre', location: '', date: '2026-08-14', time: '16:00', level: 'Intermédiaire', description: '' });
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function coordinatesFromLink(value) {
    const match = value.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/) || value.match(/[?&](?:q|ll)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
    return match ? { latitude: Number(match[1]), longitude: Number(match[2]) } : {};
  }

  function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 1400 / image.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        setImageUrl(canvas.toDataURL('image/jpeg', 0.78));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (form.title.trim().length < 3) {
      setError('Le titre du match doit contenir au moins 3 caractères.');
      return;
    }
    setSubmitting(true);
    try {
      const coordinates = coordinatesFromLink(form.location);
      const created = await createMatch({
        sport_name: sport,
        title: form.title.trim() || `${sport} à ${form.city}`,
        city: form.city,
        location: form.location.trim() || 'Terrain municipal',
        address: `${form.location.trim() || 'Terrain municipal'}, ${form.city}`,
        match_date: form.date,
        match_time: form.time,
        level: form.level,
        max_players: players,
        description: form.description.trim() || 'Match organisé par la communauté TeamUp.',
        organizer_first_name: user?.first_name || user?.firstName || 'Moi',
        organizer_last_name: user?.last_name || user?.lastName || '',
        organizer_email: user?.email || '',
        image_url: imageUrl,
        ...coordinates,
      });
      navigate(`/matches/${created.id}`);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <PagePanel className="p-7">
        <PageTitle title="Créer un match" subtitle="Organise ta partie." />
        {error && <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">Erreur : {error}</p>}
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <SportChoice active={sport === 'Football'} sport="Football" Icon={Football} onClick={() => setSport('Football')} />
            <SportChoice active={sport === 'Basketball'} sport="Basketball" Icon={Basketball} onClick={() => setSport('Basketball')} />
          </div>
          <Field label="Titre du match"><TextInput value={form.title} minLength={3} onChange={(event) => update('title', event.target.value)} placeholder="Ex : Foot 5 détente" required /></Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Ville"><TextInput value={form.city} onChange={(event) => update('city', event.target.value)} list="create-cities" placeholder="Nanterre" /><datalist id="create-cities"><option value="Nanterre" /><option value="Puteaux" /><option value="Courbevoie" /><option value="Levallois" /></datalist></Field>
            <Field label="Lieu"><TextInput value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Ex : Stade municipal" /></Field>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Date"><TextInput type="date" value={form.date} onChange={(event) => update('date', event.target.value)} required /></Field>
            <Field label="Heure"><TextInput type="time" value={form.time} onChange={(event) => update('time', event.target.value)} required /></Field>
          </div>
          <Field label="Niveau"><SelectInput value={form.level} onChange={(event) => update('level', event.target.value)}><option>Débutant</option><option>Intermédiaire</option><option>Confirmé</option></SelectInput></Field>
          <Field label="Nombre max. de joueurs"><div className="inline-flex w-fit items-center rounded-lg border border-slate-200"><button type="button" className="h-10 w-12 text-lg font-bold text-slate-600" onClick={() => setPlayers(Math.max(2, players - 1))}>−</button><span className="grid h-10 w-16 place-items-center border-x border-slate-200 text-sm font-black text-slate-950">{players}</span><button type="button" className="h-10 w-12 text-lg font-bold text-slate-600" onClick={() => setPlayers(Math.min(30, players + 1))}>+</button></div></Field>
          <Field label="Description"><textarea value={form.description} onChange={(event) => update('description', event.target.value)} className="min-h-36 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-lime-600" placeholder="Ambiance, niveau, règles..." /></Field>
          <Field label="Photo du match (facultatif)">
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} className="sr-only" />
            <button type="button" onClick={() => fileRef.current?.click()} className="rounded-lg border border-dashed border-slate-300 px-5 py-3 text-sm font-bold text-slate-600 hover:border-lime-700 hover:text-lime-700">Ajouter une image</button>
            {imageUrl && <img src={imageUrl} alt="Aperçu du match" className="mt-3 h-32 w-56 rounded-lg object-cover" />}
          </Field>
          <button type="submit" disabled={submitting} className={`h-12 rounded-lg text-sm font-black text-white hover:opacity-90 disabled:cursor-wait disabled:opacity-60 ${sport === 'Basketball' ? 'bg-orange-500' : 'bg-lime-700'}`}>{submitting ? 'Publication en cours...' : 'Publier le match'}</button>
        </form>
      </PagePanel>
    </div>
  );
}

function SportChoice({ active, sport, Icon, onClick }) {
  const isBasket = sport === 'Basketball';
  return <button type="button" onClick={onClick} className={`flex h-12 items-center justify-center gap-3 rounded-lg border text-sm font-black transition ${active ? isBasket ? 'border-orange-500 text-orange-600' : 'border-lime-700 text-lime-700' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}><Icon size={16} color="currentColor" />{sport}</button>;
}
