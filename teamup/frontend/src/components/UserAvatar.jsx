import { getAvatarSource } from '../utils/avatar';

export default function UserAvatar({ user = {}, size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-20 w-20 text-xl',
    xl: 'h-36 w-36 text-4xl',
  };
  const firstName = user.first_name || user.firstName || user.name?.split(' ')[0] || '';
  const lastName = user.last_name || user.lastName || user.name?.split(' ').slice(1).join(' ') || '';
  const initials = `${firstName[0] || 'T'}${lastName[0] || 'U'}`.toUpperCase();
  const name = user.name || [firstName, lastName].filter(Boolean).join(' ') || 'Utilisateur TeamUp';

  const avatar = getAvatarSource(user);

  if (avatar) {
    return <img src={avatar} alt={`Photo de profil de ${name}`} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white ${className}`} />;
  }

  return (
    <div aria-label={`Avatar de ${name}`} className={`${sizes[size]} grid place-items-center rounded-full bg-emerald-100 font-bold text-emerald-700 ring-2 ring-white ${className}`}>
      {initials}
    </div>
  );
}
