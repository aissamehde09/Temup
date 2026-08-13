import { CheckCircle } from './landing/icons';

export default function SuccessToast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-lime-200 bg-lime-50 px-5 py-4 text-lime-900 shadow-sm">
      <div className="flex items-center gap-3">
        <CheckCircle size={18} color="#3F6212" />
        <p className="text-sm font-black">{message}</p>
      </div>
      <button type="button" onClick={onClose} className="rounded-full px-2 py-1 text-lg leading-none hover:bg-lime-100">
        ×
      </button>
    </div>
  );
}
