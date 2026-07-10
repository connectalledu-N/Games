import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db } from './db.js';
import { runSeed } from './seed.js';

import { crudRouter } from './lib/crud.js';
import postsRouter from './routes/posts.js';
import platformNotesRouter from './routes/platformNotes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// First boot on a fresh volume (no brands yet) — load the locked starting
// plan automatically so a new deploy isn't blank.
if (db.prepare('SELECT COUNT(*) c FROM brands').get().c === 0) {
  console.log('No data found — seeding the locked PLAYISSM starting plan…');
  runSeed();
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/brands', crudRouter('brands'));
app.use('/api/pillars', crudRouter('pillars'));
app.use('/api/platforms', crudRouter('platforms', { jsonFields: ['cadence_days'] }));
app.use('/api/sequences', crudRouter('sequences'));
app.use('/api/hashtag-groups', crudRouter('hashtag_groups', { jsonFields: ['tags'] }));
app.use('/api/wiki', crudRouter('wiki_pages'));
app.use('/api/posts', postsRouter);
app.use('/api/platform-notes', platformNotesRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// In production (Railway etc.) the client is built to client/dist and served
// from this same process, so the whole app is one deployable service.
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`PLAYISSM Content OS listening on http://localhost:${PORT}`);
});
