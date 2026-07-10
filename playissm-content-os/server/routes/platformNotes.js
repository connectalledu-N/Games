import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const { platform_id } = req.query;
  const rows = platform_id
    ? db
        .prepare('SELECT * FROM platform_notes WHERE platform_id = ? ORDER BY created_at DESC, id DESC')
        .all(platform_id)
    : db.prepare('SELECT * FROM platform_notes ORDER BY created_at DESC, id DESC').all();
  res.json(rows);
});

router.post('/', (req, res) => {
  const { platform_id, content } = req.body;
  const info = db
    .prepare('INSERT INTO platform_notes (platform_id, content) VALUES (?, ?)')
    .run(platform_id, content);
  const row = db.prepare('SELECT * FROM platform_notes WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(row);
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM platform_notes WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
