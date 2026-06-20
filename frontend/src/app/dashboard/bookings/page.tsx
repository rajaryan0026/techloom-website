'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BookingsPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => (await api.get('/users/me/bookings')).data.data,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Consultation Bookings</h1>
      {bookings?.length ? (
        <div className="space-y-4">
          {bookings.map((b: { id: string; datetime: string; status: string; service?: { name: string }; notes?: string }) => (
            <Card key={b.id}>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-base">{b.service?.name || 'Consultation'}</CardTitle>
                <span className="text-xs text-brand">{b.status}</span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-surface-gray">{formatDate(b.datetime)}</p>
                {b.notes && <p className="mt-2 text-sm">{b.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-surface-gray">No bookings yet.</p>
      )}
    </div>
  );
}