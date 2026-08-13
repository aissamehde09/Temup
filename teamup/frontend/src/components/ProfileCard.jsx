import UserAvatar from './UserAvatar';

export default function ProfileCard({ user }) {
  return (
    <aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center gap-4">
        <UserAvatar user={user} size="lg" />
        <div>
          <h3 className="text-xl font-bold">{user?.first_name || 'Utilisateur'}</h3>
          <p className="text-sm text-slate-500">{user?.city}</p>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-slate-50 p-4">
          <dt className="text-slate-500">Niveau</dt>
          <dd className="font-semibold">{user?.level}</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <dt className="text-slate-500">Note</dt>
          <dd className="font-semibold">{user?.stats?.average_rating || '0'} / 5</dd>
        </div>
      </dl>
    </aside>
  );
}

