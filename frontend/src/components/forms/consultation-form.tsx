'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ConsultationForm({ serviceId }: { serviceId?: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '', datetime: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings', {
        ...form,
        serviceId,
        datetime: new Date(form.datetime).toISOString(),
      });
      setSuccess(true);
    } catch {
      alert('Failed to book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <h3 className="text-xl font-semibold text-brand">Booking Confirmed!</h3>
        <p className="mt-2 text-surface-gray">We&apos;ll reach out shortly to confirm your consultation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-4">
      <Input placeholder="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input type="datetime-local" required value={form.datetime} onChange={(e) => setForm({ ...form, datetime: e.target.value })} />
      <Textarea placeholder="Additional notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Booking...' : 'Book Consultation'}
      </Button>
    </form>
  );
}