import { Router } from 'express';
import { db } from '../db.js';

// Generic REST CRUD router factory for simple reference tables.
// jsonFields: columns stored as JSON text that should be parsed/stringified.
export function crudRouter(table, { jsonFields = [] } = {}) {
  const router = Router();

  function serialize(row) {
    if (!row) return row;
    const out = { ...row };
    for (const f of jsonFields) {
      try {
        out[f] = JSON.parse(out[f] ?? '[]');
      } catch {
        out[f] = [];
      }
    }
    return out;
  }

  function prepareInput(body) {
    const out = { ...body };
    for (const f of jsonFields) {
      if (f in out) out[f] = JSON.stringify(out[f] ?? []);
    }
    // better-sqlite3 only binds numbers, strings, bigints, buffers, and null —
    // booleans (e.g. a platform's "active" checkbox) need coercing to 0/1.
    for (const key of Object.keys(out)) {
      if (typeof out[key] === 'boolean') out[key] = out[key] ? 1 : 0;
    }
    delete out.id;
    return out;
  }

  router.get('/', (req, res) => {
    const rows = db.prepare(`SELECT * FROM ${table} ORDER BY id`).all();
    res.json(rows.map(serialize));
  });

  router.get('/:id', (req, res) => {
    const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(serialize(row));
  });

  router.post('/', (req, res) => {
    const data = prepareInput(req.body);
    const cols = Object.keys(data);
    const placeholders = cols.map((c) => `@${c}`).join(', ');
    const stmt = db.prepare(
      `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`
    );
    const info = stmt.run(data);
    const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(info.lastInsertRowid);
    res.status(201).json(serialize(row));
  });

  router.put('/:id', (req, res) => {
    const data = prepareInput(req.body);
    const cols = Object.keys(data);
    if (cols.length === 0) {
      const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id);
      return res.json(serialize(row));
    }
    const setClause = cols.map((c) => `${c} = @${c}`).join(', ');
    db.prepare(`UPDATE ${table} SET ${setClause} WHERE id = @id`).run({
      ...data,
      id: req.params.id,
    });
    const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(serialize(row));
  });

  router.delete('/:id', (req, res) => {
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id);
    res.status(204).end();
  });

  return router;
}
