import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

function serializePost(row) {
  if (!row) return row;
  let hashtags = [];
  let media = [];
  try {
    hashtags = JSON.parse(row.hashtags ?? '[]');
  } catch {
    hashtags = [];
  }
  try {
    media = JSON.parse(row.media ?? '[]');
  } catch {
    media = [];
  }
  return { ...row, hashtags, media };
}

function attachRelations(post) {
  post.checklist = db
    .prepare('SELECT * FROM checklist_items WHERE post_id = ? ORDER BY sort_order, id')
    .all(post.id);
  post.links = db
    .prepare(
      `SELECT pl.id, pl.relation_label, p.id AS post_id, p.title, p.status, p.scheduled_date
       FROM post_links pl JOIN posts p ON p.id = pl.related_post_id
       WHERE pl.post_id = ?`
    )
    .all(post.id);
  return post;
}

router.get('/', (req, res) => {
  const { platform_id, pillar_id, status, from, to, sequence_id } = req.query;
  const clauses = [];
  const params = {};

  if (platform_id) {
    clauses.push('platform_id = @platform_id');
    params.platform_id = platform_id;
  }
  if (pillar_id) {
    clauses.push('pillar_id = @pillar_id');
    params.pillar_id = pillar_id;
  }
  if (status) {
    clauses.push('status = @status');
    params.status = status;
  }
  if (sequence_id) {
    clauses.push('sequence_id = @sequence_id');
    params.sequence_id = sequence_id;
  }
  if (from) {
    clauses.push('scheduled_date >= @from');
    params.from = from;
  }
  if (to) {
    clauses.push('scheduled_date <= @to');
    params.to = to;
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const rows = db
    .prepare(`
      SELECT posts.*,
        (SELECT COUNT(*) FROM checklist_items WHERE checklist_items.post_id = posts.id) AS checklist_total,
        (SELECT COUNT(*) FROM checklist_items WHERE checklist_items.post_id = posts.id AND done = 1) AS checklist_done
      FROM posts ${where} ORDER BY scheduled_date, scheduled_time
    `)
    .all(params);
  res.json(rows.map(serializePost));
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(attachRelations(serializePost(row)));
});

router.post('/', (req, res) => {
  const b = req.body;
  const stmt = db.prepare(`
    INSERT INTO posts
      (title, platform_id, pillar_id, scheduled_date, scheduled_time, status,
       content_body, hashtags, media, notes, sequence_id, sequence_order, updated_at)
    VALUES
      (@title, @platform_id, @pillar_id, @scheduled_date, @scheduled_time, @status,
       @content_body, @hashtags, @media, @notes, @sequence_id, @sequence_order, datetime('now'))
  `);
  const info = stmt.run({
    title: b.title ?? 'Untitled post',
    platform_id: b.platform_id ?? null,
    pillar_id: b.pillar_id ?? null,
    scheduled_date: b.scheduled_date ?? null,
    scheduled_time: b.scheduled_time ?? '11:00',
    status: b.status ?? 'Idea',
    content_body: b.content_body ?? '',
    hashtags: JSON.stringify(b.hashtags ?? []),
    media: JSON.stringify(b.media ?? []),
    notes: b.notes ?? '',
    sequence_id: b.sequence_id ?? null,
    sequence_order: b.sequence_order ?? null,
  });

  if (Array.isArray(b.checklist)) {
    const insertItem = db.prepare(
      'INSERT INTO checklist_items (post_id, label, done, sort_order) VALUES (?, ?, ?, ?)'
    );
    b.checklist.forEach((item, i) => {
      insertItem.run(info.lastInsertRowid, item.label, item.done ? 1 : 0, i);
    });
  }

  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(attachRelations(serializePost(row)));
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const b = req.body;
  const merged = {
    title: b.title ?? existing.title,
    platform_id: b.platform_id ?? existing.platform_id,
    pillar_id: b.pillar_id ?? existing.pillar_id,
    scheduled_date: b.scheduled_date ?? existing.scheduled_date,
    scheduled_time: b.scheduled_time ?? existing.scheduled_time,
    status: b.status ?? existing.status,
    content_body: b.content_body ?? existing.content_body,
    hashtags: JSON.stringify(b.hashtags ?? JSON.parse(existing.hashtags ?? '[]')),
    media: JSON.stringify(b.media ?? JSON.parse(existing.media ?? '[]')),
    notes: b.notes ?? existing.notes,
    sequence_id: b.sequence_id !== undefined ? b.sequence_id : existing.sequence_id,
    sequence_order: b.sequence_order !== undefined ? b.sequence_order : existing.sequence_order,
    id: req.params.id,
  };
  db.prepare(`
    UPDATE posts SET
      title = @title, platform_id = @platform_id, pillar_id = @pillar_id,
      scheduled_date = @scheduled_date, scheduled_time = @scheduled_time, status = @status,
      content_body = @content_body, hashtags = @hashtags, media = @media, notes = @notes,
      sequence_id = @sequence_id, sequence_order = @sequence_order, updated_at = datetime('now')
    WHERE id = @id
  `).run(merged);
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  res.json(attachRelations(serializePost(row)));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

// Checklist sub-resource
router.post('/:id/checklist', (req, res) => {
  const { label } = req.body;
  const maxOrder = db
    .prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM checklist_items WHERE post_id = ?')
    .get(req.params.id).m;
  const info = db
    .prepare('INSERT INTO checklist_items (post_id, label, done, sort_order) VALUES (?, ?, 0, ?)')
    .run(req.params.id, label, maxOrder + 1);
  const row = db.prepare('SELECT * FROM checklist_items WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(row);
});

router.put('/:id/checklist/:itemId', (req, res) => {
  const existing = db.prepare('SELECT * FROM checklist_items WHERE id = ?').get(req.params.itemId);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const label = req.body.label ?? existing.label;
  const done = req.body.done !== undefined ? (req.body.done ? 1 : 0) : existing.done;
  db.prepare('UPDATE checklist_items SET label = ?, done = ? WHERE id = ?').run(
    label,
    done,
    req.params.itemId
  );
  const row = db.prepare('SELECT * FROM checklist_items WHERE id = ?').get(req.params.itemId);
  res.json(row);
});

router.delete('/:id/checklist/:itemId', (req, res) => {
  db.prepare('DELETE FROM checklist_items WHERE id = ?').run(req.params.itemId);
  res.status(204).end();
});

// Related-post links
router.post('/:id/links', (req, res) => {
  const { related_post_id, relation_label } = req.body;
  const info = db
    .prepare('INSERT INTO post_links (post_id, related_post_id, relation_label) VALUES (?, ?, ?)')
    .run(req.params.id, related_post_id, relation_label ?? '');
  res.status(201).json({ id: info.lastInsertRowid, related_post_id, relation_label });
});

router.delete('/:id/links/:linkId', (req, res) => {
  db.prepare('DELETE FROM post_links WHERE id = ?').run(req.params.linkId);
  res.status(204).end();
});

export default router;
