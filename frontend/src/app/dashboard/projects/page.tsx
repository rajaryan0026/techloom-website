'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Project } from '@/types';

const statusColors: Record<string, string> = {
  PENDING: 'text-yellow-500',
  IN_PROGRESS: 'text-blue-500',
  REVIEW: 'text-purple-500',
  COMPLETED: 'text-green-500',
  ON_HOLD: 'text-gray-500',
};

export default function ProjectsPage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['my-projects'],
    queryFn: async () => (await api.get('/users/me/projects')).data.data as Project[],
  });

  if (isLoading) return <p>Loading projects...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Projects</h1>
      {projects?.length ? (
        <div className="space-y-4">
          {projects.map((p) => (
            <Link key={p.id} href={`/dashboard/projects/${p.id}`}>
              <Card className="hover:border-brand/30 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{p.title}</CardTitle>
                  <span className={`text-xs font-medium ${statusColors[p.status]}`}>{p.status.replace('_', ' ')}</span>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-sm text-surface-gray">{p.progress}%</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-surface-gray">No projects yet. Contact us to get started!</p>
      )}
    </div>
  );
}