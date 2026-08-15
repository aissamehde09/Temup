import { PagePanel, PageTitle } from '../components/InternalUI';
import EmptyState from '../components/EmptyState';
import { CalendarDays, MessageCircle, Star, Trophy, User } from '../components/landing/icons';
import { useNotifications } from '../context/NotificationContext';
import { useSocial } from '../context/SocialContext';
import UserAvatar from '../components/UserAvatar';

const iconByType = {
  MATCH_JOINED: [User, '#65A30D'],
  MATCH_CREATED: [Trophy, '#65A30D'],
  MATCH_LEFT: [User, '#64748B'],
  MATCH_FULL: [Trophy, '#65A30D'],
  MATCH_UPDATED: [CalendarDays, '#0EA5E9'],
  MATCH_REMINDER: [Star, '#F97316'],
  INFO: [MessageCircle, '#9333EA'],
};

export default function NotificationsPage() {
  const { notifications, unreadCount, notificationError, markRead, markAllRead } = useNotifications();
  const { friendRequests, acceptFriendRequest, rejectFriendRequest } = useSocial();
  const pendingFriendRequests = friendRequests.filter((request) => request.status === 'pending' && request.sender);

  return (
    <div className="mx-auto max-w-[1180px]">
      <PagePanel className="p-7">
        <PageTitle
          title="Notifications"
          action={(
            <button type="button" onClick={markAllRead} disabled={!unreadCount} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
              Tout marquer comme lu
            </button>
          )}
        />

        {notificationError && (
          <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            {notificationError}
          </p>
        )}

        {pendingFriendRequests.length > 0 && (
          <div className="mb-6 rounded-xl border border-lime-200 bg-lime-50 p-4">
            <h2 className="text-base font-black text-slate-950">Demandes d’amis</h2>
            <div className="mt-3 grid gap-3">
              {pendingFriendRequests.map((request) => (
                <div key={request.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={request.sender} size="md" />
                    <div>
                      <p className="text-sm font-black text-slate-950">{request.sender.firstName} souhaite t’ajouter à ses amis.</p>
                      <p className="text-xs font-medium text-slate-500">{request.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => acceptFriendRequest(request.id)} className="rounded-lg bg-lime-700 px-4 py-2 text-xs font-black text-white hover:bg-lime-800">
                      Accepter
                    </button>
                    <button type="button" onClick={() => rejectFriendRequest(request.id)} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-50">
                      Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {notifications.length ? (
          <div>
            {notifications.map((notification) => {
              const [Icon, color] = iconByType[notification.type] || iconByType.INFO;
              return (
                <button key={notification._id} type="button" onClick={() => markRead(notification._id)} className={`grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-5 border-b border-slate-100 py-5 text-left last:border-b-0 ${notification.read ? 'opacity-70' : ''}`}>
                  <span className="grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: `${color}14`, color }}><Icon size={20} color="currentColor" /></span>
                  <span><span className="block text-base font-black text-slate-950">{notification.message}</span><span className="mt-1 block text-sm font-medium text-slate-500">{notification.context}</span></span>
                  <span className="text-sm font-medium text-slate-500">{notification.createdAt}</span>
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: notification.read ? '#CBD5E1' : color }} aria-label={notification.read ? 'Lue' : 'Non lue'} />
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState title="Aucune notification" description="Tu n’as aucune notification pour le moment." />
        )}
      </PagePanel>
    </div>
  );
}
