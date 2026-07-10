import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// DATA_DIR lets a persistent volume (e.g. a Railway volume) override where
// the sqlite file lives, so data survives redeploys instead of living in
// the ephemeral container filesystem.
const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'content-os.sqlite');
export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#6366f1',
  parent_id INTEGER REFERENCES brands(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pillars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#0ea5e9',
  brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS platforms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  account_type TEXT,
  cadence_days TEXT NOT NULL DEFAULT '[]',
  default_time TEXT NOT NULL DEFAULT '11:00',
  icon TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#f59e0b',
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS sequences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  platform_id INTEGER REFERENCES platforms(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  platform_id INTEGER REFERENCES platforms(id) ON DELETE SET NULL,
  pillar_id INTEGER REFERENCES pillars(id) ON DELETE SET NULL,
  scheduled_date TEXT,
  scheduled_time TEXT NOT NULL DEFAULT '11:00',
  status TEXT NOT NULL DEFAULT 'Idea',
  content_body TEXT NOT NULL DEFAULT '',
  hashtags TEXT NOT NULL DEFAULT '[]',
  media TEXT NOT NULL DEFAULT '[]',
  notes TEXT NOT NULL DEFAULT '',
  sequence_id INTEGER REFERENCES sequences(id) ON DELETE SET NULL,
  sequence_order INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS checklist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS post_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  related_post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  relation_label TEXT
);

CREATE TABLE IF NOT EXISTS hashtag_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  pillar_id INTEGER REFERENCES pillars(id) ON DELETE SET NULL,
  tags TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS wiki_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT
);
`);

// Lightweight migration: CREATE TABLE IF NOT EXISTS won't retrofit new
// columns onto a database created by an earlier version of this schema.
const platformColumns = db.prepare('PRAGMA table_info(platforms)').all().map((c) => c.name);
if (!platformColumns.includes('icon')) {
  db.exec("ALTER TABLE platforms ADD COLUMN icon TEXT NOT NULL DEFAULT ''");
}

export default db;
