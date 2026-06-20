'use client';

import { useState } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle2 } from 'lucide-react';
import type { Service } from '@/types';

export function ContactForm({ services = [] }: { services?: Service[] }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', serviceId: '', message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload: Record<string, string> = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };
    if (form.phone.trim()) payload.phone = form.phone.trim();
    if (form.company.trim()) payload.company = form.company.trim();
    if (form.serviceId) payload.serviceId = form.serviceId;

    try {
      const { data } = await api.post('/contact', payload);
      setEmailSent(data.emailSent !== false);
      setSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setError('Cannot reach our server. Please try again in a moment or contact us on WhatsApp.');
        } else if (err.response.data?.errors) {
          const msgs = Object.values(err.response.data.errors).flat().filter(Boolean);
          setError(msgs.join(', ') || 'Please check the form fields and try again.');
        } else if (err.response.status >= 500) {
          setError('Server error. Please try again shortly or message us on WhatsApp.');
        } else {
          setError(err.response.data?.message || 'Failed to send message. Please try again.');
        }
      } else {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-premium rounded-3xl p-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/20 text-brand">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-gradient-shimmer">Message Sent!</h3>
        <p className="mt-3 text-surface-gray">
          {emailSent
            ? "We've emailed you a confirmation and our team will reply within 24 hours."
            : 'Your message was received and saved. Our team will follow up within 24 hours. You can also reach us on WhatsApp for a faster reply.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-premium space-y-5 rounded-3xl p-8 sm:p-10">
      <div>
        <h2 className="font-display text-2xl font-semibold">Send a Message</h2>
        <p className="mt-1 text-sm text-surface-gray">Fill out the form and we&apos;ll get back to you shortly.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input placeholder="Full Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input type="email" placeholder="Email *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
      </div>
      {services.length > 0 && (
        <select
          className="flex h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground shadow-elevated transition-all focus-visible:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25 dark:shadow-elevated-dark"
          value={form.serviceId}
          onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
        >
          <option value="">Service Interested In</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      )}
      <Textarea placeholder="Your message *" required rows={5} minLength={10} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Sending...' : (
          <>
            Send Message
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}