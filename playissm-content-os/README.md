# PLAYISSM Content OS

A self-hosted, single-user planning tool for PLAYISSM's content operation —
brands, pillars, platforms, posts, sequences, hashtags, and reference docs
all in one place instead of scattered chat threads and exported markdown.

## Stack

- **Server**: Express + better-sqlite3 (`server/`) — REST API over a local SQLite file.
- **Client**: React + Vite + Tailwind (`client/`) — calendar, kanban board, sequence
  tracker, dashboard, hashtag library, and reference wiki.

## Getting started

```bash
npm install      # installs both workspaces
npm run seed      # loads the locked PLAYISSM strategy as starting data
npm run dev       # starts the API (port 4000) and the client (port 5173)
```

Open http://localhost:5173.

`npm run seed` is destructive — it wipes and reloads every table from
`server/seed.js`. Re-run it any time you want to reset back to the locked
starting plan; day-to-day edits you make in the app live only in
`server/data/content-os.sqlite` (gitignored) until you re-seed.

## Structure

- `server/db.js` — schema (brands, pillars, platforms, posts, checklist_items,
  post_links, sequences, hashtag_groups, wiki_pages).
- `server/seed.js` — the locked strategy: 4 brands, 4 pillars, 8 platforms
  (with cadences), the LinkedIn 4-post reveal arc, the Substack 5-essay /
  15-post launch arc, and the current week's posts.
- `server/routes/posts.js` — posts + nested checklist items + related-post links.
- `client/src/pages/` — CalendarPage, KanbanPage, SequencesPage, DashboardPage,
  HashtagsPage, WikiPage.
- `client/src/components/PostModal.jsx` — the single post editor used everywhere
  (calendar, board, sequences, dashboard all open the same modal).

## Out of scope for v1

No multi-user auth, no direct publishing/API integration with the platforms
themselves, no analytics. This is a planning tool — posting still happens
manually or via whatever tool you already use for that.
