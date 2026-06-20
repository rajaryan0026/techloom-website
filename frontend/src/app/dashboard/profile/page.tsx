'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await api.get('/users/me')).data.data,
  });

  const [form, setForm] = useState({ name: '', phone: '', company: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  const updateProfile = useMutation({
    mutationFn: (data: typeof form) => api.patch('/users/me', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  const changePassword = useMutation({
    mutationFn: (data: typeof passwords) => api.patch('/users/me/password', data),
    onSuccess: () => { setPasswords({ currentPassword: '', newPassword: '' }); alert('Password updated'); },
  });

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name, phone: profile.phone || '', company: profile.company || '' });
    }
  }, [profile]);

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <Card>
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
          <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" />
          <Button onClick={() => updateProfile.mutate(form)} disabled={updateProfile.isPending}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input type="password" placeholder="Current Password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
          <Input type="password" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
          <Button onClick={() => changePassword.mutate(passwords)} disabled={changePassword.isPending}>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}