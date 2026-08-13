import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Link as LinkIcon, Mail, MessageCircle, Share2, UserPlus, X } from 'lucide-react';

const inviteMessage =
  'Rejoins-moi sur TeamUp ! Trouve des joueurs de foot ou de basket près de chez toi et organise tes prochains matchs.';

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export default function InviteFriendsModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');

  const inviteLink = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/`;
  }, []);

  const fullMessage = `${inviteMessage} ${inviteLink}`;
  const encodedMessage = encodeURIComponent(fullMessage);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleEscape(event) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!isOpen) return null;

  async function handleCopy() {
    try {
      await copyText(inviteLink);
      setCopyError('');
      setCopied(true);
    } catch {
      setCopied(false);
      setCopyError('Impossible de copier automatiquement le lien. Tu peux le sélectionner et le copier manuellement.');
    }
  }

  function shareWhatsapp() {
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  }

  function shareEmail() {
    const subject = encodeURIComponent('Rejoins-moi sur TeamUp');
    const body = encodeURIComponent(`${inviteMessage}\n\n${inviteLink}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  async function shareNative() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'TeamUp',
          text: inviteMessage,
          url: inviteLink,
        });
        return;
      }

      await handleCopy();
    } catch {
      await handleCopy();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] grid place-items-center bg-[#02090a]/75 px-4 py-6 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-friends-title"
        className="teamup-invite-modal w-full max-w-3xl rounded-2xl border border-white/12 bg-[#071719] p-5 text-white shadow-2xl shadow-black/50 sm:p-7"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="float-right grid h-10 w-10 cursor-pointer place-items-center rounded-full text-white/55 transition hover:bg-white/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
          aria-label="Fermer la fenêtre d’invitation"
        >
          <X size={24} aria-hidden="true" />
        </button>

        <div className="flex gap-5 pr-10">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/7 text-lime-500">
            <UserPlus size={34} aria-hidden="true" />
          </div>
          <div>
            <h2 id="invite-friends-title" className="text-2xl font-black leading-tight sm:text-3xl">
              Invite un ami sur TeamUp
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
              Partage TeamUp avec tes amis et trouvez plus facilement des joueurs pour vos prochains matchs.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-white/70">Ton lien d’invitation</p>
          <div className="flex flex-col gap-3 rounded-xl border border-white/12 bg-white/[0.03] p-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
              <LinkIcon className="shrink-0 text-lime-500" size={24} aria-hidden="true" />
              <span className="truncate text-sm font-black text-white sm:text-base">{inviteLink}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-lime-700 px-5 py-3 text-sm font-black text-white transition hover:bg-lime-800 focus:outline-none focus:ring-2 focus:ring-lime-400"
            >
              {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
              {copied ? 'Lien copié !' : 'Copier le lien'}
            </button>
          </div>
        </div>

        {copied && (
          <div className="mt-5 flex items-start gap-4 rounded-xl border border-lime-700/45 bg-lime-500/8 p-4 text-sm leading-6 text-white/75">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lime-600 text-white">
              <Check size={20} aria-hidden="true" />
            </span>
            <p>Le lien a été copié dans ton presse-papiers. Tu peux maintenant le partager avec tes amis.</p>
          </div>
        )}

        {copyError && (
          <div className="mt-5 rounded-xl border border-orange-500/35 bg-orange-500/8 p-4 text-sm leading-6 text-orange-100">
            {copyError}
          </div>
        )}

        <div className="my-7 flex items-center gap-4 text-sm text-white/50">
          <span className="h-px flex-1 bg-white/12" />
          <span>ou partager via</span>
          <span className="h-px flex-1 bg-white/12" />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <button type="button" onClick={shareWhatsapp} className="teamup-invite-share-button">
            <MessageCircle size={24} className="text-green-400" aria-hidden="true" />
            WhatsApp
          </button>
          <button type="button" onClick={shareEmail} className="teamup-invite-share-button">
            <Mail size={24} className="text-sky-400" aria-hidden="true" />
            E-mail
          </button>
          <button type="button" onClick={shareNative} className="teamup-invite-share-button">
            <Share2 size={24} className="text-lime-500" aria-hidden="true" />
            Autres options
          </button>
        </div>
      </section>
    </div>
  );
}
