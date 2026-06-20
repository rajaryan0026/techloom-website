'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/users/me/notifications')).data.data,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`/users/me/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      {notifications?.length ? (
        <div className="space-y-3">
          {notifications.map((n: { id: string; title: string; message: string; read: boolean; createdAt: string }) => (
            <div
              key={n.id}
              className={`glass rounded-xl p-4 cursor-pointer ${!n.read ? 'border-brand/30' : ''}`}
              onClick={() => !n.read && markRead.mutate(n.id)}
            >
              <div className="flex justify-between">
                <h3 className="font-medium text-sm">{n.title}</h3>
                {!n.read && <span className="h-2 w-2 rounded-full bg-brand" />}
              </div>
              <p className="mt-1 text-sm text-surface-gray">{n.message}</p>
              <p className="mt-2 text-xs text-surface-gray">{formatDate(n.createdAt)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-surface-gray">No notifications.</p>
      )}
    </div>
  );
}