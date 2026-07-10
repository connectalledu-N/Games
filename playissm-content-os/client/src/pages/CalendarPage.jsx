import React, { useMemo, useState } from 'react';
import { useData } from '../DataContext.jsx';
import { usePostModal } from '../PostModalContext.jsx';
import FilterBar, { applyFilters } from '../components/FilterBar.jsx';
import { ColorBadge, StatusBadge } from '../components/Badge.jsx';
import { STATUS_STYLES } from '../constants.js';
import {
  addDays,
  formatDayLabel,
  formatMonthYear,
  getMonthMatrix,
  getWeekDays,
  isSameDay,
  toISODate,
} from '../lib/dates.js';

export default function CalendarPage() {
  const { posts, platforms, pillars, platformById, pillarById } = useData();
  const { openPost, openNewPost } = usePostModal();
  const [view, setView] = useState('month'); // 'month' | 'week'
  const [anchor, setAnchor] = useState(new Date());
  const [colorBy, setColorBy] = useState('platform');
  const [filters, setFilters] = useState({ platformId: null, pillarId: null, status: null });
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));

  const filteredPosts = useMemo(() => applyFilters(posts, filters), [posts, filters]);

  const postsByDate = useMemo(() => {
    const map = {};
    for (const p of filteredPosts) {
      if (!p.scheduled_date) continue;
      (map[p.scheduled_date] ??= []).push(p);
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => (a.scheduled_time ?? '').localeCompare(b.scheduled_time ?? ''));
    }
    return map;
  }, [filteredPosts]);

  const weeks =
    view === 'month'
      ? getMonthMatrix(anchor.getFullYear(), anchor.getMonth())
      : [getWeekDays(anchor)];

  function colorFor(post) {
    if (colorBy === 'pillar') return pillarById(post.pillar_id)?.color ?? '#94a3b8';
    return platformById(post.platform_id)?.color ?? '#94a3b8';
  }

  function step(delta) {
    setAnchor((d) => addDays(d, view === 'month' ? delta * 30 : delta * 7));
  }

  const todayISO = toISODate(new Date());
  const selectedPosts = postsByDate[selectedDate] ?? [];

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-slate-900">
              {view === 'month' ? formatMonthYear(anchor) : `Week of ${formatDayLabel(getWeekDays(anchor)[0])}`}
            </h1>
            <div className="flex items-center gap-1">
              <button onClick={() => step(-1)} className="nav-btn">
                ‹
              </button>
              <button onClick={() => setAnchor(new Date())} className="nav-btn text-xs">
                Today
              </button>
              <button onClick={() => step(1)} className="nav-btn">
                ›
              </button>
            </div>
            <div className="flex rounded-md border border-slate-300 text-xs overflow-hidden">
              <button
                onClick={() => setView('week')}
                className={`px-2 py-1 ${view === 'week' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600'}`}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-2 py-1 ${view === 'month' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600'}`}
              >
                Month
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">
              Color by{' '}
              <select
                className="ml-1 rounded border border-slate-300 px-1 py-0.5 text-xs"
                value={colorBy}
                onChange={(e) => setColorBy(e.target.value)}
              >
                <option value="platform">Platform</option>
                <option value="pillar">Pillar</option>
              </select>
            </label>
            <button
              onClick={() => openNewPost({ scheduled_date: selectedDate })}
              className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              + New post
            </button>
          </div>
        </div>

        <FilterBar platforms={platforms} pillars={pillars} filters={filters} onChange={setFilters} />

        <div className="mt-4 grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 text-xs font-medium text-slate-400">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="bg-slate-50 px-2 py-1.5 text-center">
              {d}
            </div>
          ))}
        </div>
        <div
          className={`grid grid-cols-7 gap-px overflow-hidden rounded-b-lg border-x border-b border-slate-200 bg-slate-200 ${
            view === 'month' ? '' : ''
          }`}
        >
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              const iso = toISODate(day);
              const inMonth = view === 'week' || day.getMonth() === anchor.getMonth();
              const dayPosts = postsByDate[iso] ?? [];
              const isToday = iso === todayISO;
              const isSelected = iso === selectedDate;
              return (
                <button
                  key={`${wi}-${di}`}
                  onClick={() => setSelectedDate(iso)}
                  className={`min-h-[92px] ${
                    view === 'week' ? 'min-h-[220px]' : ''
                  } flex flex-col items-stretch bg-white p-1.5 text-left align-top ${
                    inMonth ? '' : 'bg-slate-50 text-slate-300'
                  } ${isSelected ? 'ring-2 ring-inset ring-violet-400' : ''}`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={`text-xs ${
                        isToday
                          ? 'flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 font-semibold text-white'
                          : inMonth
                          ? 'text-slate-500'
                          : 'text-slate-300'
                      }`}
                    >
                      {day.getDate()}
                    </span>
                    {dayPosts.length > 0 && (
                      <span className="text-[10px] text-slate-300">{dayPosts.length}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5 overflow-hidden">
                    {dayPosts.slice(0, view === 'week' ? 12 : 3).map((p) => (
                      <div
                        key={p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openPost(p.id);
                        }}
                        className="truncate rounded px-1 py-0.5 text-[11px] leading-tight text-white hover:opacity-80"
                        style={{ backgroundColor: colorFor(p) }}
                        title={p.title}
                      >
                        {p.scheduled_time} {p.title}
                      </div>
                    ))}
                    {view === 'month' && dayPosts.length > 3 && (
                      <div className="text-[10px] text-slate-400">+{dayPosts.length - 3} more</div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <DayPanel date={selectedDate} posts={selectedPosts} onOpen={openPost} onNew={openNewPost} />
    </div>
  );
}

function DayPanel({ date, posts, onOpen, onNew }) {
  const { platformById, pillarById } = useData();
  return (
    <aside className="w-80 shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          })}
        </h2>
        <button onClick={() => onNew({ scheduled_date: date })} className="text-xs text-violet-600 hover:text-violet-800">
          + Add
        </button>
      </div>
      {posts.length === 0 ? (
        <p className="text-sm text-slate-400">Nothing scheduled.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li
              key={p.id}
              onClick={() => onOpen(p.id)}
              className="cursor-pointer rounded-lg border border-slate-200 p-3 hover:border-violet-300 hover:bg-violet-50/40"
            >
              <div className="mb-1 text-sm font-medium text-slate-800">{p.title}</div>
              <div className="mb-2 flex flex-wrap gap-1.5">
                <ColorBadge label={platformById(p.platform_id)?.name} color={platformById(p.platform_id)?.color ?? '#94a3b8'} />
                <ColorBadge label={pillarById(p.pillar_id)?.name} color={pillarById(p.pillar_id)?.color ?? '#94a3b8'} />
                <StatusBadge status={p.status} style={STATUS_STYLES[p.status] ?? STATUS_STYLES.Idea} />
              </div>
              <ChecklistProgress total={p.checklist_total} done={p.checklist_done} />
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function ChecklistProgress({ total, done }) {
  if (!total) return <p className="text-[11px] text-slate-300">No checklist yet</p>;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(done / total) * 100}%` }} />
      </div>
      <span className="text-[11px] text-slate-400">
        {done}/{total}
      </span>
    </div>
  );
}
