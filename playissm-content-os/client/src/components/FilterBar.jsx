import React from 'react';
import { STATUSES } from '../constants.js';

export default function FilterBar({
  platforms,
  pillars,
  filters,
  onChange,
  showStatus = true,
}) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  const active = filters.platformId || filters.pillarId || (showStatus && filters.status);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700"
        value={filters.pillarId ?? ''}
        onChange={(e) => set('pillarId', e.target.value || null)}
      >
        <option value="">All pillars</option>
        {pillars.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <select
        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700"
        value={filters.platformId ?? ''}
        onChange={(e) => set('platformId', e.target.value || null)}
      >
        <option value="">All platforms</option>
        {platforms.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      {showStatus && (
        <select
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700"
          value={filters.status ?? ''}
          onChange={(e) => set('status', e.target.value || null)}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}
      {active && (
        <button
          onClick={() => onChange({ platformId: null, pillarId: null, status: null })}
          className="text-xs text-slate-400 hover:text-slate-700 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export function applyFilters(posts, filters) {
  return posts.filter((p) => {
    if (filters.platformId && String(p.platform_id) !== String(filters.platformId)) return false;
    if (filters.pillarId && String(p.pillar_id) !== String(filters.pillarId)) return false;
    if (filters.status && p.status !== filters.status) return false;
    return true;
  });
}
