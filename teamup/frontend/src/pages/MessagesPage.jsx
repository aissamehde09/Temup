import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CircleInfo,
  EmptyBox,
  Paperclip,
  Phone,
  Search,
  Video,
} from '../components/landing/icons';
import { useSocial } from '../context/SocialContext';
import UserAvatar from '../components/UserAvatar';

function getLastMessage(conversation) {
  return conversation.messages.at(-1)?.text || 'Aucun message';
}

export default function MessagesPage() {
  const { conversations, markConversationRead, sendMessage } = useSocial();
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('tous');
  const [draft, setDraft] = useState('');
  const [sendError, setSendError] = useState('');
  const [notice, setNotice] = useState('');

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const matchesFilter = filter === 'tous' || conversation.filter === filter;
      const matchesSearch = !query || `${conversation.name} ${conversation.context} ${getLastMessage(conversation)}`.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [conversations, search, filter]);

  const active = conversations.find((item) => item.id === activeId) || filteredConversations[0] || conversations[0];

  function openConversation(id) {
    setActiveId(id);
    markConversationRead(id);
    setSendError('');
  }

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2400);
  }

  async function handleSend(event) {
    event.preventDefault();
    if (!active || (active.type === 'match' && active.canWrite === false)) return;
    const cleanDraft = draft.trim();
    if (!cleanDraft) return;

    try {
      await sendMessage(active.id, cleanDraft);
      setDraft('');
      setSendError('');
    } catch {
      setSendError("Le message n’a pas pu être envoyé. Vérifie la connexion au serveur.");
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1220px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:grid-cols-[360px_1fr]">
      <aside className="flex min-h-[520px] flex-col border-r border-slate-200">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-950">Messages</h1>
              <p className="mt-1 text-sm text-slate-500">{conversations.length} conversations</p>
            </div>
            <span className="rounded-full bg-lime-50 px-3 py-1 text-xs font-black text-lime-700">
              {conversations.reduce((total, item) => total + item.unread, 0)} non lus
            </span>
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-lime-500 focus-within:bg-white">
            <Search size={16} color="#64748B" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              placeholder="Rechercher une conversation..."
            />
          </label>

          <div className="mt-4 grid grid-cols-3 rounded-xl bg-slate-100 p-1">
            {[
              ['tous', 'Tous'],
              ['matchs', 'Matchs'],
              ['amis', 'Amis'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-lg px-3 py-2 text-xs font-black transition ${
                  filter === value ? 'bg-white text-lime-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => openConversation(conversation.id)}
                className={`grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-100 px-6 py-4 text-left transition ${
                  active?.id === conversation.id ? 'bg-lime-50' : 'hover:bg-slate-50'
                }`}
              >
                <span className="relative">
                  <UserAvatar user={{ name: conversation.name, avatar: conversation.avatar }} size="lg" />
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-lime-500" />
                  )}
                </span>

                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-base font-black text-slate-950">{conversation.name}</span>
                    {conversation.unread > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1.5 text-[10px] font-black text-white">
                        {conversation.unread}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-medium text-slate-500">{conversation.context}</span>
                  <span className="mt-1 block truncate text-xs text-slate-400">{getLastMessage(conversation)}</span>
                </span>

                <span className="text-xs font-medium text-slate-400">{conversation.time}</span>
              </button>
            ))
          ) : (
            <div className="grid min-h-80 place-items-center p-8 text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-400">
                  <EmptyBox size={22} color="currentColor" />
                </div>
                <p className="mt-4 text-sm font-black text-slate-900">Aucune conversation</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">Aucun résultat pour ta recherche.</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {active ? (
        <section className="flex min-h-[680px] flex-col bg-white">
          <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div className="flex min-w-0 items-center gap-4">
              <span className="relative shrink-0">
                <UserAvatar user={{ name: active.name, avatar: active.avatar }} size="lg" />
                {active.online && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-lime-500" />
                )}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-black text-slate-950">{active.name}</h2>
                <p className="truncate text-sm font-medium text-slate-500">{active.context}</p>
              </div>
            </div>

            <div className="flex gap-2 text-slate-400">
              <button type="button" onClick={() => showNotice('Les appels seront ajoutés dans une prochaine version.')} className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-slate-200 transition hover:border-lime-600 hover:text-lime-700" aria-label="Appeler">
                <Phone size={16} color="currentColor" />
              </button>
              <button type="button" onClick={() => showNotice('La vidéo sera ajoutée dans une prochaine version.')} className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-slate-200 transition hover:border-lime-600 hover:text-lime-700" aria-label="Démarrer une vidéo">
                <Video size={16} color="currentColor" />
              </button>
              <button type="button" onClick={() => showNotice('Les informations de conversation seront ajoutées plus tard.')} className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-slate-200 transition hover:border-lime-600 hover:text-lime-700" aria-label="Informations">
                <CircleInfo size={16} color="currentColor" />
              </button>
            </div>
          </header>

          {notice ? (
            <p role="status" className="mx-6 mt-4 rounded-xl bg-lime-50 px-4 py-3 text-sm font-bold text-lime-800">
              {notice}
            </p>
          ) : null}

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-gradient-to-b from-white to-slate-50/70 p-6">
            <div className="mx-auto w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
              Aujourd’hui
            </div>

            {active.messages.map((message, index) => (
              <div key={`${message.author}-${message.time}-${index}`} className={`flex gap-3 ${message.mine ? 'justify-end' : 'justify-start'}`}>
                {!message.mine && <UserAvatar user={{ name: active.name, avatar: active.avatar }} size="sm" className="mt-1" />}
                <div className={`max-w-[min(72%,520px)] ${message.mine ? 'text-right' : ''}`}>
                  <p className={`rounded-2xl px-5 py-3 text-sm font-semibold leading-6 shadow-sm ${message.mine ? 'rounded-br-md bg-lime-50 text-lime-950' : 'rounded-bl-md bg-white text-slate-800 ring-1 ring-slate-200'}`}>
                    {message.text}
                  </p>
                  <span className="mt-1.5 block text-xs font-medium text-slate-400">{message.time}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-100 bg-white p-5">
            {sendError ? (
              <p role="alert" className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {sendError}
              </p>
            ) : null}
            <div className="flex items-center gap-3">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-lime-500">
              <input
                value={draft}
                disabled={active.type === 'match' && active.canWrite === false}
                onChange={(event) => setDraft(event.target.value)}
                className="min-w-0 flex-1 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 disabled:bg-white disabled:text-slate-400"
                placeholder={active.type === 'match' && active.canWrite === false ? 'Rejoins ce match pour écrire.' : 'Écrire un message...'}
              />
              <button type="button" onClick={() => showNotice('Les pièces jointes seront ajoutées dans une prochaine version.')} className="text-slate-400 transition hover:text-lime-700" aria-label="Ajouter une pièce jointe">
                <Paperclip size={17} color="currentColor" />
              </button>
            </label>
            <button
              type="submit"
              disabled={!draft.trim() || (active.type === 'match' && active.canWrite === false)}
              className="grid h-12 w-12 cursor-pointer place-items-center rounded-xl bg-lime-700 text-white transition hover:bg-lime-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              aria-label="Envoyer le message"
            >
              <ArrowRight size={17} color="currentColor" />
            </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
