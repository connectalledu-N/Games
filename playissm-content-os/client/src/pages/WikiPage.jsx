import React, { useEffect, useState } from 'react';
import { useData } from '../DataContext.jsx';
import { api } from '../api.js';
import { renderMiniMarkdown } from '../lib/miniMarkdown.jsx';

export default function WikiPage() {
  const { refreshReference } = useData();
  const [pages, setPages] = useState([]);
  const [activeSlug, setActiveSlug] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  async function load() {
    const rows = await api.wiki.list();
    rows.sort((a, b) => a.sort_order - b.sort_order);
    setPages(rows);
    if (!activeSlug && rows.length) setActiveSlug(rows[0].slug);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = pages.find((p) => p.slug === activeSlug);

  function startEdit() {
    setDraft(active.content);
    setEditing(true);
  }

  async function save() {
    await api.wiki.update(active.id, { content: draft });
    setEditing(false);
    await load();
  }

  return (
    <div className="flex h-full">
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Reference & strategy</h2>
        <ul className="space-y-1">
          {pages.map((p) => (
            <li key={p.slug}>
              <button
                onClick={() => {
                  setActiveSlug(p.slug);
                  setEditing(false);
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                  activeSlug === p.slug ? 'bg-violet-100 text-violet-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 overflow-y-auto p-6">
        {active && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 flex items-center justify-end">
              {editing ? (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
                    Cancel
                  </button>
                  <button
                    onClick={save}
                    className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button onClick={startEdit} className="text-sm text-violet-600 hover:text-violet-800">
                  Edit page
                </button>
              )}
            </div>
            {editing ? (
              <textarea
                className="input min-h-[60vh] font-mono text-sm"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            ) : (
              renderMiniMarkdown(active.content)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
