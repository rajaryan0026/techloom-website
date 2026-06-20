'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Lead } from '@/types';

const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED'];

export default function AdminLeadsPage() {
  const queryClient = useQueryClient();
  const { data: leads, isLoading } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: async () => (await api.get('/admin/leads')).data.data as Lead[],
  });

  const updateLead = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/leads/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-leads'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lead Management</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-surface-gray">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Source</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads?.map((lead) => (
              <tr key={lead.id} className="border-b border-white/5">
                <td className="py-3 pr-4 font-medium">{lead.name}</td>
                <td className="py-3 pr-4 text-surface-gray">{lead.email}</td>
                <td className="py-3 pr-4 text-surface-gray">{lead.source}</td>
                <td className="py-3 pr-4">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLead.mutate({ id: lead.id, status: e.target.value })}
                    className="rounded-lg bg-white/5 px-2 py-1 text-xs border border-white/10"
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-3 text-surface-gray">{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!leads?.length && <p className="text-surface-gray py-8 text-center">No leads yet.</p>}
      </div>
    </div>
  );
}