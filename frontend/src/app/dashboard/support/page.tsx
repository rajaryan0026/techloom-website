'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupportPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', content: '', priority: 'MEDIUM' });

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => (await api.get('/users/me/support-tickets')).data.data,
  });

  const createTicket = useMutation({
    mutationFn: (data: typeof form) => api.post('/users/me/support-tickets', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      setShowForm(false);
      setForm({ subject: '', content: '', priority: 'MEDIUM' });
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <Button onClick={() => setShowForm(!showForm)}>New Ticket</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-4">
            <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <Textarea placeholder="Describe your issue" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <Button onClick={() => createTicket.mutate(form)} disabled={createTicket.isPending}>Submit Ticket</Button>
          </CardContent>
        </Card>
      )}

      {tickets?.length ? (
        <div className="space-y-4">
          {tickets.map((t: { id: string; subject: string; status: string; priority: string; messages: { content: string; sender: { name: string } }[] }) => (
            <Card key={t.id}>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-base">{t.subject}</CardTitle>
                <span className="text-xs text-brand">{t.status}</span>
              </CardHeader>
              <CardContent>
                {t.messages?.map((m, i) => (
                  <div key={i} className="text-sm mb-2">
                    <span className="font-medium">{m.sender.name}: </span>{m.content}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-surface-gray">No support tickets.</p>
      )}
    </div>
  );
}