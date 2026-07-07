import express from 'express';
import cors from 'cors';
import './db.js';

import { crudRouter } from './lib/crud.js';
import postsRouter from './routes/posts.js';

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

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`PLAYISSM Content OS API listening on http://localhost:${PORT}`);
});
