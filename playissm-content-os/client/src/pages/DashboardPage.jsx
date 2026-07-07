import React, { useMemo, useState } from 'react';
import { useData } from '../DataContext.jsx';
import { usePostModal } from '../PostModalContext.jsx';
import { ColorBadge, StatusBadge } from '../components/Badge.jsx';
import { STATUS_STYLES } from '../constants.js';

export default function DashboardPage() {
  const { pillars, platforms, posts, pillarById, platformById } = useData();
  const { openPost } = usePostModal();
  const [pillarId, setPillarId] = useState(null);
  const [platformId, setPlatformId] = useState(null);
  const [scope, setScope] = useState('all'); // 'all' | 'month'

  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const scoped = useMemo(() => {
    return posts.filter((p) => (scope === 'month' ? (p.scheduled_date ?? '').startsWith(monthPrefix) : true));
  }, [posts, scope, monthPrefix]);

  const results = useMemo(() => {
    return scoped
      .filter((p) => (pillarId ? p.pillar_id === pillarId : true))
      .filter((p) => (platformId ? p.platform_id === platformId : true))
      .sort((a, b) => (a.scheduled_date ?? '9999').localeCompare(b.scheduled_date ?? '9999'));
  }, [scoped, pillarId, platformId]);

  function countFor(kind, id) {
    return scoped.filter((p) => (kind === 'pillar' ? p.pillar_id === id : p.platform_id === id)).length;
  }

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Pillar & platform dashboard</h1>
        <div className="flex rounded-md border border-slate-300 text-xs overflow-hidden">
          <button
            onClick={() => setScope('all')}
            className={`px-3 py-1 ${scope === 'all' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600'}`}
          >
            All time
          </button>
          <button
            onClick={() => setScope('month')}
            className={`px-3 py-1 ${scope === 'month' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600'}`}
          >
            This month
          </button>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Pillars</h2>
        <div className="flex flex-wrap gap-2">
          {pillars.map((p) => (
            <button
              key={p.id}
              onClick={() => setPillarId(pillarId === p.id ? null : p.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                pillarId === p.id ? 'border-violet-400 bg-violet-50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="font-medium text-slate-700">{p.name}</span>
              <span className="text-xs text-slate-400">{countFor('pillar', p.id)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Platforms</h2>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatformId(platformId === p.id ? null : p.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                platformId === p.id ? 'border-violet-400 bg-violet-50' : 'border-slate-200 bg-white hover:border-slate-300'
              } ${!p.active ? 'opacity-40' : ''}`}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="font-medium text-slate-700">{p.name}</span>
              <span className="text-xs text-slate-400">{countFor('platform', p.id)}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {results.length} matching post{results.length === 1 ? '' : 's'}
          </h2>
          {(pillarId || platformId) && (
            <button
              onClick={() => {
                setPillarId(null);
                setPlatformId(null);
              }}
              className="text-xs text-slate-400 underline hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-slate-400">Nothing matches yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {results.map((p) => (
                <li
                  key={p.id}
                  onClick={() => openPost(p.id)}
                  className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-800">{p.title}</div>
                    <div className="text-xs text-slate-400">{p.scheduled_date ?? 'unscheduled'}</div>
                  </div>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                    <ColorBadge label={platformById(p.platform_id)?.name} color={platformById(p.platform_id)?.color ?? '#94a3b8'} />
                    <ColorBadge label={pillarById(p.pillar_id)?.name} color={pillarById(p.pillar_id)?.color ?? '#94a3b8'} />
                    <StatusBadge status={p.status} style={STATUS_STYLES[p.status] ?? STATUS_STYLES.Idea} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
