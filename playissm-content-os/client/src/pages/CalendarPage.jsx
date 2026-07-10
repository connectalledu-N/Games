import React, { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useData } from '../DataContext.jsx';
import { usePostModal } from '../PostModalContext.jsx';
import FilterBar, { applyFilters } from '../components/FilterBar.jsx';
import { ColorBadge, StatusBadge } from '../components/Badge.jsx';
import Confetti from '../components/Confetti.jsx';
import { STATUS_STYLES, STATUSES } from '../constants.js';
import {
  addDays,
  formatDayLabel,
  formatMonthYear,
  getMonthMatrix,
  getWeekDays,
  toISODate,
} from '../lib/dates.js';

// An "open slot" is a seeded/blank cadence placeholder: no pillar assigned,
// no content written yet. Styled dashed so it visibly invites filling in,
// and stops looking like one the moment real content lands on it.
function isOpenSlot(post) {
  return !post.pillar_id && !post.content_body && post.status === 'Idea';
}

function computeStreak(posts) {
  const postedDates = new Set(
    posts.filter((p) => p.status === 'Posted' && p.scheduled_date).map((p) => p.scheduled_date)
  );
  let cursor = new Date();
  if (!postedDates.has(toISODate(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (postedDates.has(toISODate(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export default function CalendarPage() {
  const { posts, platforms, pillars, platformById, pillarById, updatePost } = useData();
  const { openPost, openNewPost } = usePostModal();
  const [view, setView] = useState('month'); // 'month' | 'week'
  const [anchor, setAnchor] = useState(new Date());
  const [colorBy, setColorBy] = useState('platform');
  const [filters, setFilters] = useState({ platformId: null, pillarId: null, status: null });
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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

  const visiblePosts = useMemo(() => {
    const isos = new Set(weeks.flat().map(toISODate));
    return filteredPosts.filter((p) => isos.has(p.scheduled_date));
  }, [weeks, filteredPosts]);

  const statusCounts = useMemo(() => {
    const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    for (const p of visiblePosts) counts[p.status] = (counts[p.status] ?? 0) + 1;
    return counts;
  }, [visiblePosts]);

  const streak = useMemo(() => computeStreak(posts), [posts]);

  function colorFor(post) {
    if (colorBy === 'pillar') return pillarById(post.pillar_id)?.color ?? '#94a3b8';
    return platformById(post.platform_id)?.color ?? '#94a3b8';
  }

  function step(delta) {
    setAnchor((d) => addDays(d, view === 'month' ? delta * 30 : delta * 7));
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const post = posts.find((p) => String(p.id) === active.id);
    if (post && post.scheduled_date !== over.id) {
      updatePost(post.id, { scheduled_date: over.id });
    }
  }

  const todayISO = toISODate(new Date());
  const selectedPosts = postsByDate[selectedDate] ?? [];
  const activePost = posts.find((p) => String(p.id) === activeId);

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
            {streak > 0 && (
              <span
                key={streak}
                className="streak-pop inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600 ring-1 ring-orange-200"
                title="Consecutive days with something posted"
              >
                🔥 {streak}-day streak
              </span>
            )}
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

        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <FilterBar platforms={platforms} pillars={pillars} filters={filters} onChange={setFilters} />
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {STATUSES.map((s) =>
              statusCounts[s] ? (
                <span
                  key={s}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${STATUS_STYLES[s].bg} ${STATUS_STYLES[s].text}`}
                >
                  {statusCounts[s]} {s}
                </span>
              ) : null
            )}
          </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={(e) => setActiveId(e.active.id)}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 text-xs font-medium text-slate-400">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="bg-slate-50 px-2 py-1.5 text-center">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-b-lg border-x border-b border-slate-200 bg-slate-200">
            {weeks.map((week, wi) =>
              week.map((day, di) => (
                <DayCell
                  key={`${wi}-${di}`}
                  day={day}
                  view={view}
                  anchor={anchor}
                  isToday={toISODate(day) === todayISO}
                  isSelected={toISODate(day) === selectedDate}
                  posts={postsByDate[toISODate(day)] ?? []}
                  onSelect={() => setSelectedDate(toISODate(day))}
                  onOpen={openPost}
                  colorFor={colorFor}
                  platformById={platformById}
                />
              ))
            )}
          </div>

          <DragOverlay>
            {activePost && (
              <div
                className="rounded px-2 py-1 text-xs text-white shadow-lg"
                style={{ backgroundColor: colorFor(activePost) }}
              >
                {activePost.title}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <DayPanel date={selectedDate} posts={selectedPosts} onOpen={openPost} onNew={openNewPost} />
    </div>
  );
}

function DayCell({ day, view, anchor, isToday, isSelected, posts, onSelect, onOpen, colorFor, platformById }) {
  const iso = toISODate(day);
  const { setNodeRef, isOver } = useDroppable({ id: iso });
  const inMonth = view === 'week' || day.getMonth() === anchor.getMonth();

  return (
    <div
      ref={setNodeRef}
      onClick={onSelect}
      className={`min-h-[92px] ${
        view === 'week' ? 'min-h-[220px]' : ''
      } flex cursor-pointer flex-col items-stretch bg-white p-1.5 text-left align-top ${
        inMonth ? '' : 'bg-slate-50 text-slate-300'
      } ${isSelected ? 'ring-2 ring-inset ring-violet-400' : ''} ${
        isOver ? 'bg-violet-50 ring-2 ring-inset ring-violet-300' : ''
      }`}
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
        {posts.length > 0 && <span className="text-[10px] text-slate-300">{posts.length}</span>}
      </div>
      <div className="flex-1 space-y-0.5 overflow-hidden">
        {posts.slice(0, view === 'week' ? 12 : 3).map((p) => (
          <PostChip key={p.id} post={p} onOpen={onOpen} colorFor={colorFor} platformById={platformById} />
        ))}
        {view === 'month' && posts.length > 3 && (
          <div className="text-[10px] text-slate-400">+{posts.length - 3} more</div>
        )}
      </div>
    </div>
  );
}

function PostChip({ post, onOpen, colorFor, platformById }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: String(post.id) });
  const openSlot = isOpenSlot(post);
  const icon = platformById(post.platform_id)?.icon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(post.id);
      }}
      className={`cursor-grab truncate rounded px-1 py-0.5 text-[11px] leading-tight hover:opacity-80 active:cursor-grabbing ${
        isDragging ? 'opacity-30' : ''
      } ${
        openSlot
          ? 'border border-dashed bg-white/60 text-slate-400'
          : 'border border-transparent text-white'
      }`}
      style={
        openSlot
          ? { borderColor: colorFor(post) }
          : { backgroundColor: colorFor(post) }
      }
      title={post.title}
    >
      {openSlot ? '+ ' : `${icon ? icon + ' ' : ''}${post.scheduled_time} `}
      {post.title}
    </div>
  );
}

function DayPanel({ date, posts, onOpen, onNew }) {
  const { platformById, pillarById, updatePost } = useData();
  const [celebratingId, setCelebratingId] = useState(null);

  function markPosted(e, post) {
    e.stopPropagation();
    updatePost(post.id, { status: 'Posted' });
    setCelebratingId(post.id);
    setTimeout(() => setCelebratingId((id) => (id === post.id ? null : id)), 700);
  }

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
          {posts.map((p) => {
            const openSlot = isOpenSlot(p);
            return (
              <li
                key={p.id}
                onClick={() => onOpen(p.id)}
                className={`relative cursor-pointer rounded-lg border p-3 hover:border-violet-300 hover:bg-violet-50/40 ${
                  openSlot ? 'border-dashed border-slate-300' : 'border-slate-200'
                }`}
              >
                {celebratingId === p.id && <Confetti />}
                <div className="mb-1 flex items-start justify-between gap-2">
                  <span className={`text-sm font-medium ${openSlot ? 'text-slate-400' : 'text-slate-800'}`}>
                    {openSlot ? `+ ${p.title}` : p.title}
                  </span>
                  {p.status !== 'Posted' && !openSlot && (
                    <button
                      onClick={(e) => markPosted(e, p)}
                      title="Mark as posted"
                      className="shrink-0 rounded-full border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 hover:border-emerald-400 hover:text-emerald-600"
                    >
                      ✓ posted
                    </button>
                  )}
                </div>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <ColorBadge label={platformById(p.platform_id)?.name} color={platformById(p.platform_id)?.color ?? '#94a3b8'} />
                  {p.pillar_id && (
                    <ColorBadge label={pillarById(p.pillar_id)?.name} color={pillarById(p.pillar_id)?.color ?? '#94a3b8'} />
                  )}
                  <StatusBadge status={p.status} style={STATUS_STYLES[p.status] ?? STATUS_STYLES.Idea} />
                </div>
                {!openSlot && <ChecklistProgress total={p.checklist_total} done={p.checklist_done} />}
              </li>
            );
          })}
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
