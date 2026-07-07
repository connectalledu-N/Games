import React, { useMemo, useState } from 'react';
import { useData } from '../DataContext.jsx';
import { usePostModal } from '../PostModalContext.jsx';
import { ColorBadge, StatusBadge } from '../components/Badge.jsx';
import { STATUS_STYLES } from '../constants.js';

export default function SequencesPage() {
  const { sequences, posts, platformById } = useData();
  const { openPost, openNewPost } = usePostModal();
  const [activeId, setActiveId] = useState(sequences[0]?.id ?? null);

  const active = sequences.find((s) => s.id === activeId) ?? sequences[0];

  const steps = useMemo(() => {
    if (!active) return [];
    return posts
      .filter((p) => p.sequence_id === active.id)
      .sort((a, b) => (a.sequence_order ?? 999) - (b.sequence_order ?? 999));
  }, [posts, active]);

  const nextOrder = steps.length ? Math.max(...steps.map((s) => s.sequence_order ?? 0)) + 1 : 1;
  const completed = steps.filter((s) => s.status === 'Posted').length;

  if (sequences.length === 0) {
    return <div className="p-6 text-sm text-slate-400">No sequences yet.</div>;
  }

  return (
    <div className="flex h-full">
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Named arcs</h2>
        <ul className="space-y-1">
          {sequences.map((s) => {
            const total = posts.filter((p) => p.sequence_id === s.id).length;
            const done = posts.filter((p) => p.sequence_id === s.id && p.status === 'Posted').length;
            return (
              <li key={s.id}>
                <button
                  onClick={() => setActiveId(s.id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                    active?.id === s.id ? 'bg-violet-100 text-violet-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-slate-400">
                    {done}/{total} posted
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="flex-1 overflow-y-auto p-6">
        {active && (
          <>
            <div className="mb-1 flex items-center justify-between">
              <h1 className="text-lg font-semibold text-slate-900">{active.name}</h1>
              <button
                onClick={() => openNewPost({ sequence_id: active.id, sequence_order: nextOrder })}
                className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
              >
                + Add step
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-500">{active.description}</p>
            <div className="mb-6 h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: steps.length ? `${(completed / steps.length) * 100}%` : '0%' }}
              />
            </div>

            <ol className="relative ml-3 space-y-6 border-l-2 border-slate-200 pl-6">
              {steps.map((step, i) => {
                const isDone = step.status === 'Posted';
                return (
                  <li key={step.id} className="relative">
                    <span
                      className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                        isDone ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      {isDone ? '✓' : i + 1}
                    </span>
                    <div
                      onClick={() => openPost(step.id)}
                      className="cursor-pointer rounded-lg border border-slate-200 bg-white p-3 hover:border-violet-300 hover:bg-violet-50/40"
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">{step.title}</span>
                        <span className="text-xs text-slate-400">{step.scheduled_date}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <ColorBadge
                          label={platformById(step.platform_id)?.name}
                          color={platformById(step.platform_id)?.color ?? '#94a3b8'}
                        />
                        <StatusBadge status={step.status} style={STATUS_STYLES[step.status] ?? STATUS_STYLES.Idea} />
                      </div>
                    </div>
                  </li>
                );
              })}
              {steps.length === 0 && <p className="text-sm text-slate-400">No steps yet — add the first one.</p>}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
