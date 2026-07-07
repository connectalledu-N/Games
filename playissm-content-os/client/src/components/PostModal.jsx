import React, { useEffect, useMemo, useState } from 'react';
import { usePostModal } from '../PostModalContext.jsx';
import { useData } from '../DataContext.jsx';
import { api } from '../api.js';
import { STATUSES } from '../constants.js';

const emptyForm = {
  title: '',
  platform_id: '',
  pillar_id: '',
  scheduled_date: '',
  scheduled_time: '11:00',
  status: 'Idea',
  content_body: '',
  hashtags: [],
  media: [],
  notes: '',
  sequence_id: '',
  sequence_order: '',
};

export default function PostModal() {
  const { open, postId, draft, close } = usePostModal();
  const { platforms, pillars, sequences, hashtagGroups, posts, createPost, updatePost, deletePost, refreshPosts } =
    useData();

  const [form, setForm] = useState(emptyForm);
  const [checklist, setChecklist] = useState([]);
  const [links, setLinks] = useState([]);
  const [newChecklistLabel, setNewChecklistLabel] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [linkTarget, setLinkTarget] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  const isEditing = Boolean(postId);

  useEffect(() => {
    if (!open) return;
    if (postId) {
      setLoadingPost(true);
      api.posts
        .get(postId)
        .then((p) => {
          setForm({
            title: p.title ?? '',
            platform_id: p.platform_id ?? '',
            pillar_id: p.pillar_id ?? '',
            scheduled_date: p.scheduled_date ?? '',
            scheduled_time: p.scheduled_time ?? '11:00',
            status: p.status ?? 'Idea',
            content_body: p.content_body ?? '',
            hashtags: p.hashtags ?? [],
            media: p.media ?? [],
            notes: p.notes ?? '',
            sequence_id: p.sequence_id ?? '',
            sequence_order: p.sequence_order ?? '',
          });
          setChecklist(p.checklist ?? []);
          setLinks(p.links ?? []);
        })
        .finally(() => setLoadingPost(false));
    } else {
      setForm({ ...emptyForm, ...draft, hashtags: draft?.hashtags ?? [], media: draft?.media ?? [] });
      setChecklist([]);
      setLinks([]);
    }
  }, [open, postId, draft]);

  const relatedCandidates = useMemo(
    () => posts.filter((p) => p.id !== postId && p.title.toLowerCase().includes('')).slice(0, 500),
    [posts, postId]
  );

  if (!open) return null;

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addTag(raw) {
    const tag = raw.trim();
    if (!tag) return;
    const withHash = tag.startsWith('#') ? tag : `#${tag}`;
    if (form.hashtags.includes(withHash)) return;
    setField('hashtags', [...form.hashtags, withHash]);
  }

  function removeTag(tag) {
    setField('hashtags', form.hashtags.filter((t) => t !== tag));
  }

  function insertHashtagGroup(groupId) {
    const group = hashtagGroups.find((g) => String(g.id) === String(groupId));
    if (!group) return;
    const merged = Array.from(new Set([...form.hashtags, ...group.tags]));
    setField('hashtags', merged);
  }

  function addMediaRow() {
    setField('media', [...form.media, { type: 'image', url: '', label: '' }]);
  }

  function updateMediaRow(i, patch) {
    setField(
      'media',
      form.media.map((m, idx) => (idx === i ? { ...m, ...patch } : m))
    );
  }

  function removeMediaRow(i) {
    setField('media', form.media.filter((_, idx) => idx !== i));
  }

  async function handleAddChecklist() {
    const label = newChecklistLabel.trim();
    if (!label) return;
    setNewChecklistLabel('');
    if (isEditing) {
      const item = await api.posts.addChecklistItem(postId, label);
      setChecklist((c) => [...c, item]);
    } else {
      setChecklist((c) => [...c, { id: `tmp-${Date.now()}`, label, done: 0 }]);
    }
  }

  async function toggleChecklist(item) {
    if (isEditing && !String(item.id).startsWith('tmp-')) {
      const updated = await api.posts.updateChecklistItem(postId, item.id, { done: !item.done });
      setChecklist((c) => c.map((i) => (i.id === item.id ? updated : i)));
    } else {
      setChecklist((c) => c.map((i) => (i.id === item.id ? { ...i, done: i.done ? 0 : 1 } : i)));
    }
  }

  async function removeChecklistItem(item) {
    if (isEditing && !String(item.id).startsWith('tmp-')) {
      await api.posts.removeChecklistItem(postId, item.id);
    }
    setChecklist((c) => c.filter((i) => i.id !== item.id));
  }

  async function handleAddLink() {
    if (!linkTarget || !isEditing) return;
    const created = await api.posts.addLink(postId, linkTarget, '');
    const target = posts.find((p) => String(p.id) === String(linkTarget));
    setLinks((l) => [...l, { id: created.id, post_id: target.id, title: target.title, status: target.status, scheduled_date: target.scheduled_date }]);
    setLinkTarget('');
  }

  async function handleRemoveLink(linkId) {
    await api.posts.removeLink(postId, linkId);
    setLinks((l) => l.filter((x) => x.id !== linkId));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        platform_id: form.platform_id || null,
        pillar_id: form.pillar_id || null,
        sequence_id: form.sequence_id || null,
        sequence_order: form.sequence_order === '' ? null : Number(form.sequence_order),
      };
      if (isEditing) {
        await updatePost(postId, payload);
      } else {
        payload.checklist = checklist.map((c) => ({ label: c.label, done: Boolean(c.done) }));
        await createPost(payload);
      }
      close();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEditing) return;
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setSaving(true);
    try {
      await deletePost(postId);
      close();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {isEditing ? 'Edit post' : 'New post'}
          </h2>
          <button onClick={close} className="text-slate-400 hover:text-slate-700 text-lg leading-none">
            &times;
          </button>
        </div>

        {loadingPost ? (
          <div className="px-5 py-10 text-center text-sm text-slate-400">Loading…</div>
        ) : (
          <div className="max-h-[75vh] space-y-5 overflow-y-auto px-5 py-4">
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium"
              placeholder="Post title / internal name"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Platform">
                <select
                  className="input"
                  value={form.platform_id}
                  onChange={(e) => setField('platform_id', e.target.value)}
                >
                  <option value="">—</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Pillar">
                <select
                  className="input"
                  value={form.pillar_id}
                  onChange={(e) => setField('pillar_id', e.target.value)}
                >
                  <option value="">—</option>
                  {pillars.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Date">
                <input
                  type="date"
                  className="input"
                  value={form.scheduled_date ?? ''}
                  onChange={(e) => setField('scheduled_date', e.target.value)}
                />
              </Field>
              <Field label="Time">
                <input
                  type="time"
                  className="input"
                  value={form.scheduled_time ?? '11:00'}
                  onChange={(e) => setField('scheduled_time', e.target.value)}
                />
              </Field>
              <Field label="Status">
                <select className="input" value={form.status} onChange={(e) => setField('status', e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Sequence">
                <select
                  className="input"
                  value={form.sequence_id}
                  onChange={(e) => setField('sequence_id', e.target.value)}
                >
                  <option value="">— none —</option>
                  {sequences.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              {form.sequence_id && (
                <Field label="Sequence order">
                  <input
                    type="number"
                    className="input"
                    value={form.sequence_order ?? ''}
                    onChange={(e) => setField('sequence_order', e.target.value)}
                  />
                </Field>
              )}
            </div>

            <Field label="Content body">
              <textarea
                className="input min-h-[120px] font-normal"
                placeholder="Caption / essay / script…"
                value={form.content_body}
                onChange={(e) => setField('content_body', e.target.value)}
              />
            </Field>

            <Field label="Hashtags">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.hashtags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700"
                  >
                    {t}
                    <button onClick={() => removeTag(t)} className="text-violet-400 hover:text-violet-800">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(tagInput);
                      setTagInput('');
                    }
                  }}
                />
                <select
                  className="input w-40"
                  value=""
                  onChange={(e) => insertHashtagGroup(e.target.value)}
                >
                  <option value="">Insert group…</option>
                  {hashtagGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </Field>

            <Field label="Checklist">
              <ul className="space-y-1 mb-2">
                {checklist.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(item.done)}
                      onChange={() => toggleChecklist(item)}
                      className="h-3.5 w-3.5"
                    />
                    <span className={item.done ? 'flex-1 text-slate-400 line-through' : 'flex-1'}>
                      {item.label}
                    </span>
                    <button
                      onClick={() => removeChecklistItem(item)}
                      className="text-slate-300 hover:text-red-500 text-xs"
                    >
                      remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Add a checklist item and press Enter"
                  value={newChecklistLabel}
                  onChange={(e) => setNewChecklistLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklist();
                    }
                  }}
                />
              </div>
            </Field>

            <Field label="Media">
              <div className="space-y-2">
                {form.media.map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <select
                      className="input w-28"
                      value={m.type}
                      onChange={(e) => updateMediaRow(i, { type: e.target.value })}
                    >
                      <option value="image">Image</option>
                      <option value="carousel">Carousel slide</option>
                      <option value="video">Video</option>
                      <option value="link">Link</option>
                    </select>
                    <input
                      className="input flex-1"
                      placeholder="URL"
                      value={m.url}
                      onChange={(e) => updateMediaRow(i, { url: e.target.value })}
                    />
                    <input
                      className="input w-32"
                      placeholder="Label"
                      value={m.label}
                      onChange={(e) => updateMediaRow(i, { label: e.target.value })}
                    />
                    <button onClick={() => removeMediaRow(i)} className="text-slate-300 hover:text-red-500 text-xs">
                      remove
                    </button>
                  </div>
                ))}
                <button onClick={addMediaRow} className="text-xs text-violet-600 hover:text-violet-800">
                  + Add media attachment
                </button>
              </div>
            </Field>

            <Field label="Notes / flags">
              <input
                className="input"
                placeholder="e.g. TBD, needs Neha's input"
                value={form.notes}
                onChange={(e) => setField('notes', e.target.value)}
              />
            </Field>

            {isEditing && (
              <Field label="Related posts">
                <ul className="space-y-1 mb-2">
                  {links.map((l) => (
                    <li key={l.id} className="flex items-center gap-2 text-sm">
                      <span className="flex-1 truncate">{l.title}</span>
                      <span className="text-xs text-slate-400">{l.scheduled_date}</span>
                      <button
                        onClick={() => handleRemoveLink(l.id)}
                        className="text-slate-300 hover:text-red-500 text-xs"
                      >
                        remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <select className="input flex-1" value={linkTarget} onChange={(e) => setLinkTarget(e.target.value)}>
                    <option value="">Link to another post…</option>
                    {relatedCandidates.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleAddLink} className="rounded-md bg-slate-100 px-3 text-sm hover:bg-slate-200">
                    Link
                  </button>
                </div>
              </Field>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <div>
            {isEditing && (
              <button
                onClick={handleDelete}
                disabled={saving}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Delete post
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={close} className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loadingPost}
              className="rounded-md bg-violet-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">{label}</div>
      {children}
    </label>
  );
}
