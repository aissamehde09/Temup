export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="d-grid gap-2 small fw-semibold text-slate-700">
      {label && <span>{label}</span>}
      <input
        className={`form-control rounded-4 border-slate-200 bg-white px-4 py-3 text-slate-950 ${className}`}
        {...props}
      />
      {error && <span className="form-text text-danger">{error}</span>}
    </label>
  );
}
