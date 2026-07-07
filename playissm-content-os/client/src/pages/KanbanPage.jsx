import React, { useMemo, useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { useData } from '../DataContext.jsx';
import { usePostModal } from '../PostModalContext.jsx';
import FilterBar, { applyFilters } from '../components/FilterBar.jsx';
import { ColorBadge } from '../components/Badge.jsx';
import { STATUSES, STATUS_STYLES } from '../constants.js';

export default function KanbanPage() {
  const { posts, platforms, pillars, platformById, pillarById, updatePost } = useData();
  const { openPost, openNewPost } = usePostModal();
  const [filters, setFilters] = useState({ platformId: null, pillarId: null });
  const [activeId, setActiveId] = useState(null);

  const filteredPosts = useMemo(() => applyFilters(posts, filters), [posts, filters]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const columns = useMemo(() => {
    const map = Object.fromEntries(STATUSES.map((s) => [s, []]));
    for (const p of filteredPosts) {
      (map[p.status] ??= []).push(p);
    }
    for (const s of STATUSES) {
      map[s].sort((a, b) => (a.scheduled_date ?? '9999').localeCompare(b.scheduled_date ?? '9999'));
    }
    return map;
  }, [filteredPosts]);

  const activePost = posts.find((p) => String(p.id) === activeId);

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const newStatus = over.id;
    const post = posts.find((p) => String(p.id) === active.id);
    if (post && post.status !== newStatus) {
      updatePost(post.id, { status: newStatus });
    }
  }

  return (
    <div className="h-full overflow-hidden p-6 flex flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-slate-900">Status board</h1>
        <div className="flex items-center gap-2">
          <FilterBar platforms={platforms} pillars={pillars} filters={filters} onChange={setFilters} showStatus={false} />
          <button
            onClick={() => openNewPost({})}
            className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            + New post
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveId(e.active.id)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="flex flex-1 gap-3 overflow-x-auto">
          {STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              posts={columns[status]}
              onOpen={openPost}
              platformById={platformById}
              pillarById={pillarById}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function Column({ status, posts, onOpen, platformById, pillarById }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const style = STATUS_STYLES[status];

  return (
    <div
      ref={setNodeRef}
      className={`flex w-64 shrink-0 flex-col rounded-lg border ${
        isOver ? 'border-violet-400 bg-violet-50/50' : 'border-slate-200 bg-slate-50'
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${style.text}`}>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: style.dot }} />
          {status}
        </span>
        <span className="text-xs text-slate-400">{posts.length}</span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-2 pb-3 scrollbar-thin">
        {posts.map((p) => (
          <Card key={p.id} post={p} onOpen={onOpen} platformById={platformById} pillarById={pillarById} />
        ))}
      </div>
    </div>
  );
}

function Card({ post, onOpen, platformById, pillarById }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(post.id),
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onOpen(post.id)}
      className={`cursor-grab rounded-md border border-slate-200 bg-white p-2.5 shadow-sm hover:border-violet-300 active:cursor-grabbing ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <div className="mb-1.5 text-sm font-medium text-slate-800 leading-snug">{post.title}</div>
      <div className="mb-1.5 flex flex-wrap gap-1">
        <ColorBadge label={platformById(post.platform_id)?.name} color={platformById(post.platform_id)?.color ?? '#94a3b8'} />
        <ColorBadge label={pillarById(post.pillar_id)?.name} color={pillarById(post.pillar_id)?.color ?? '#94a3b8'} />
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>{post.scheduled_date ?? 'unscheduled'}</span>
        {post.checklist_total > 0 && (
          <span>
            {post.checklist_done}/{post.checklist_total}
          </span>
        )}
      </div>
    </div>
  );
}
