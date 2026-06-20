'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Project } from '@/types';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => (await api.get(`/users/me/projects/${id}`)).data.data as Project,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">{project.title}</h1>
      <p className="mt-2 text-surface-gray">{project.description}</p>
      <div className="mt-4 flex items-center gap-4">
        <span className="text-sm">Status: <strong>{project.status}</strong></span>
        <span className="text-sm">Progress: <strong>{project.progress}%</strong></span>
      </div>

      {project.deliverables && project.deliverables.length > 0 && (
        <Card className="mt-8">
          <CardHeader><CardTitle>Deliverables</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {project.deliverables.map((d) => (
              <a key={d.id} href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand hover:underline">
                {d.title}
              </a>
            ))}
          </CardContent>
        </Card>
      )}

      {project.invoices && project.invoices.length > 0 && (
        <Card className="mt-4">
          <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {project.invoices.map((inv) => (
              <div key={inv.id} className="flex justify-between text-sm">
                <span>${inv.amount}</span>
                <span className="text-surface-gray">{inv.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}