import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../DataContext.jsx';
import { api } from '../api.js';
import { STATUSES, STATUS_STYLES } from '../constants.js';

const WEEKDAYS = [
  { day: 1, label: 'Mon' },
  { day: 2, label: 'Tue' },
  { day: 3, label: 'Wed' },
  { day: 4, label: 'Thu' },
  { day: 5, label: 'Fri' },
  { day: 6, label: 'Sat' },
  { day: 0, label: 'Sun' },
];

export default function PlatformsPage() {
  const { platforms, posts, refreshReference } = useData();
  const [activeId, setActiveId] = useState(platforms[0]?.id ?? null);

  useEffect(() => {
    if (activeId == null && platforms.length) setActiveId(platforms[0].id);
  }, [platforms, activeId]);

  const active = platforms.find((p) => p.id === activeId);

  return (
    <div className="flex h-full">
      <aside className="w-72 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Platforms you're building for
        </h2>
        <ul className="space-y-1">
          {platforms.map((p) => {
            const count = posts.filter((post) => post.platform_id === p.id).length;
            return (
              <li key={p.id}>
                <button
                  onClick={() => setActiveId(p.id)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
                    activeId === p.id ? 'bg-violet-100 text-violet-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base leading-none">{p.icon || '●'}</span>
                  <span className="flex-1 min-w-0">
                    <div className="truncate font-medium">{p.name}</div>
                    <div className="text-xs text-slate-400">{count} posts</div>
                  </span>
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${p.active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    title={p.active ? 'Active' : 'Inactive'}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {active && (
        <PlatformDetail key={active.id} platform={active} posts={posts} onSaved={refreshReference} />
      )}
    </div>
  );
}

function PlatformDetail({ platform, posts, onSaved }) {
  const [form, setForm] = useState({
    account_type: platform.account_type ?? '',
    color: platform.color,
    icon: platform.icon ?? '',
    default_time: platform.default_time,
    cadence_days: platform.cadence_days ?? [],
    active: Boolean(platform.active),
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteDraft, setNoteDraft] = useState('');
  const [notesLoading, setNotesLoading] = useState(true);

  useEffect(() => {
    setNotesLoading(true);
    api.platformNotes.list(platform.id).then((rows) => {
      setNotes(rows);
      setNotesLoading(false);
    });
  }, [platform.id]);

  const platformPosts = useMemo(() => posts.filter((p) => p.platform_id === platform.id), [posts, platform.id]);
  const statusCounts = useMemo(() => {
    const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    for (const p of platformPosts) counts[p.status] = (counts[p.status] ?? 0) + 1;
    return counts;
  }, [platformPosts]);

  function toggleDay(day) {
    setForm((f) => ({
      ...f,
      cadence_days: f.cadence_days.includes(day)
        ? f.cadence_days.filter((d) => d !== day)
        : [...f.cadence_days, day].sort(),
    }));
  }

  async function save() {
    setSaving(true);
    try {
      await api.platforms.update(platform.id, form);
      await onSaved();
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  async function addNote() {
    const content = noteDraft.trim();
    if (!content) return;
    const created = await api.platformNotes.create(platform.id, content);
    setNotes((n) => [created, ...n]);
    setNoteDraft('');
  }

  async function removeNote(id) {
    await api.platformNotes.remove(id);
    setNotes((n) => n.filter((note) => note.id !== id));
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="text-3xl leading-none">{form.icon || '●'}</span>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{platform.name}</h1>
            <p className="text-sm text-slate-400">
              {platformPosts.length} post{platformPosts.length === 1 ? '' : 's'} planned
            </p>
          </div>
        </div>

        <div className="mb-2 flex flex-wrap gap-2">
          {STATUSES.map((s) =>
            statusCounts[s] ? (
              <span
                key={s}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[s].bg} ${STATUS_STYLES[s].text}`}
              >
                {statusCounts[s]} {s}
              </span>
            ) : null
          )}
          {platformPosts.length === 0 && <span className="text-xs text-slate-400">No posts yet.</span>}
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Account details</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <div className="mb-1 text-xs text-slate-400">Account type</div>
              <input
                className="input"
                value={form.account_type}
                onChange={(e) => setForm((f) => ({ ...f, account_type: e.target.value }))}
              />
            </label>
            <label className="block">
              <div className="mb-1 text-xs text-slate-400">Default time</div>
              <input
                type="time"
                className="input"
                value={form.default_time}
                onChange={(e) => setForm((f) => ({ ...f, default_time: e.target.value }))}
              />
            </label>
            <label className="block">
              <div className="mb-1 text-xs text-slate-400">Icon (emoji)</div>
              <input
                className="input"
                maxLength={4}
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              />
            </label>
            <label className="block">
              <div className="mb-1 text-xs text-slate-400">Color</div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-10 rounded border border-slate-300"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                />
                <input
                  className="input flex-1"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                />
              </div>
            </label>
          </div>

          <div className="mt-4">
            <div className="mb-1 text-xs text-slate-400">Posting cadence</div>
            <div className="flex flex-wrap gap-1.5">
              {WEEKDAYS.map(({ day, label }) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    form.cadence_days.includes(day)
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            Actively building on this platform
          </label>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-md bg-violet-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save details'}
            </button>
            {saved && <span className="text-xs text-emerald-600">Saved</span>}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Study notes</h2>
          <p className="mb-3 text-xs text-slate-400">
            What you learn about this platform as you study it — algorithm quirks, format tips, what
            worked, what didn't. Keeps accumulating over time.
          </p>
          <div className="mb-4 flex gap-2">
            <textarea
              className="input min-h-[70px] font-normal"
              placeholder="Add a note…"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  addNote();
                }
              }}
            />
          </div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={addNote}
              disabled={!noteDraft.trim()}
              className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Add note
            </button>
          </div>

          {notesLoading ? (
            <p className="text-sm text-slate-400">Loading notes…</p>
          ) : notes.length === 0 ? (
            <p className="text-sm text-slate-400">No notes yet — jot something down after your first deep-dive.</p>
          ) : (
            <ul className="space-y-2">
              {notes.map((n) => (
                <li key={n.id} className="rounded-md bg-slate-50 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {new Date(n.created_at.replace(' ', 'T') + 'Z').toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                    <button onClick={() => removeNote(n.id)} className="text-[11px] text-slate-300 hover:text-red-500">
                      remove
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-slate-700">{n.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
