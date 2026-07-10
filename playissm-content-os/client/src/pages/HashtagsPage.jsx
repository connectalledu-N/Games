import React, { useState } from 'react';
import { useData } from '../DataContext.jsx';
import { api } from '../api.js';

export default function HashtagsPage() {
  const { hashtagGroups, pillars, pillarById, refreshReference } = useData();
  const [creating, setCreating] = useState(false);

  async function handleDelete(id) {
    if (!window.confirm('Delete this hashtag group?')) return;
    await api.hashtagGroups.remove(id);
    await refreshReference();
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Hashtag library</h1>
          <p className="text-sm text-slate-500">Reusable tag sets per pillar — pull these into any post instead of retyping.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
        >
          + New group
        </button>
      </div>

      {creating && (
        <GroupEditor
          pillars={pillars}
          onCancel={() => setCreating(false)}
          onSave={async (data) => {
            await api.hashtagGroups.create(data);
            await refreshReference();
            setCreating(false);
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hashtagGroups.map((g) => (
          <GroupCard key={g.id} group={g} pillar={pillarById(g.pillar_id)} onDelete={() => handleDelete(g.id)} onSaved={refreshReference} pillars={pillars} />
        ))}
      </div>
    </div>
  );
}

function GroupCard({ group, pillar, onDelete, onSaved, pillars }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <GroupEditor
        pillars={pillars}
        initial={group}
        onCancel={() => setEditing(false)}
        onSave={async (data) => {
          await api.hashtagGroups.update(group.id, data);
          await onSaved();
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-1 flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-800">{group.name}</div>
          {pillar && (
            <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pillar.color }} />
              {pillar.name}
            </span>
          )}
        </div>
        <div className="flex gap-2 text-xs">
          <button onClick={() => setEditing(true)} className="text-slate-400 hover:text-violet-600">
            edit
          </button>
          <button onClick={onDelete} className="text-slate-400 hover:text-red-500">
            delete
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {group.tags.map((t) => (
          <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function GroupEditor({ pillars, initial, onCancel, onSave }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [pillarId, setPillarId] = useState(initial?.pillar_id ?? '');
  const [tags, setTags] = useState(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState('');

  function addTag() {
    const t = tagInput.trim();
    if (!t) return;
    const withHash = t.startsWith('#') ? t : `#${t}`;
    if (!tags.includes(withHash)) setTags([...tags, withHash]);
    setTagInput('');
  }

  return (
    <div className="mb-4 rounded-lg border border-violet-200 bg-violet-50/40 p-4">
      <div className="mb-2 grid grid-cols-2 gap-2">
        <input className="input" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="input" value={pillarId} onChange={(e) => setPillarId(e.target.value)}>
          <option value="">— pillar —</option>
          {pillars.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200">
            {t}
            <button onClick={() => setTags(tags.filter((x) => x !== t))} className="text-slate-400 hover:text-red-500">
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="mb-3 flex gap-2">
        <input
          className="input flex-1"
          placeholder="Add a tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-white">
          Cancel
        </button>
        <button
          onClick={() => onSave({ name, pillar_id: pillarId || null, tags })}
          disabled={!name}
          className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}
