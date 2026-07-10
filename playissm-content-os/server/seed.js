// Seeds the database with the locked PLAYISSM content strategy.
// Safe to re-run: it wipes and reloads all tables (your local sqlite file
// is a planning cache, not a source of truth — the source of truth is this file
// and whatever you edit in the app afterward).
import { fileURLToPath } from 'node:url';
import { db } from './db.js';

export function runSeed() {

const wipe = db.transaction(() => {
  for (const t of [
    'checklist_items',
    'post_links',
    'posts',
    'sequences',
    'hashtag_groups',
    'wiki_pages',
    'pillars',
    'platforms',
    'brands',
  ]) {
    db.exec(`DELETE FROM ${t}`);
    db.exec(`DELETE FROM sqlite_sequence WHERE name = '${t}'`);
  }
});

function insertBrand({ name, description, color, parent_id = null }) {
  const info = db
    .prepare('INSERT INTO brands (name, description, color, parent_id) VALUES (?, ?, ?, ?)')
    .run(name, description, color, parent_id);
  return info.lastInsertRowid;
}

function insertPillar({ name, description, color, brand_id }) {
  const info = db
    .prepare('INSERT INTO pillars (name, description, color, brand_id) VALUES (?, ?, ?, ?)')
    .run(name, description, color, brand_id);
  return info.lastInsertRowid;
}

function insertPlatform({ name, account_type, cadence_days, default_time = '11:00', icon = '', color, active = 1 }) {
  const info = db
    .prepare(
      'INSERT INTO platforms (name, account_type, cadence_days, default_time, icon, color, active) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .run(name, account_type, JSON.stringify(cadence_days), default_time, icon, color, active ? 1 : 0);
  return info.lastInsertRowid;
}

function insertSequence({ name, description, platform_id }) {
  const info = db
    .prepare('INSERT INTO sequences (name, description, platform_id) VALUES (?, ?, ?)')
    .run(name, description, platform_id);
  return info.lastInsertRowid;
}

function insertPost(p) {
  const info = db
    .prepare(
      `INSERT INTO posts
        (title, platform_id, pillar_id, scheduled_date, scheduled_time, status,
         content_body, hashtags, media, notes, sequence_id, sequence_order)
       VALUES (@title, @platform_id, @pillar_id, @scheduled_date, @scheduled_time, @status,
         @content_body, @hashtags, @media, @notes, @sequence_id, @sequence_order)`
    )
    .run({
      title: p.title,
      platform_id: p.platform_id,
      pillar_id: p.pillar_id,
      scheduled_date: p.scheduled_date,
      scheduled_time: p.scheduled_time ?? '11:00',
      status: p.status ?? 'Idea',
      content_body: p.content_body ?? '',
      hashtags: JSON.stringify(p.hashtags ?? []),
      media: JSON.stringify(p.media ?? []),
      notes: p.notes ?? '',
      sequence_id: p.sequence_id ?? null,
      sequence_order: p.sequence_order ?? null,
    });
  const postId = info.lastInsertRowid;
  (p.checklist ?? []).forEach((label, i) => {
    db.prepare(
      'INSERT INTO checklist_items (post_id, label, done, sort_order) VALUES (?, ?, 0, ?)'
    ).run(postId, label, i);
  });
  return postId;
}

function insertHashtagGroup({ name, pillar_id, tags }) {
  db.prepare('INSERT INTO hashtag_groups (name, pillar_id, tags) VALUES (?, ?, ?)').run(
    name,
    pillar_id,
    JSON.stringify(tags)
  );
}

function insertWiki({ slug, title, content, sort_order = 0 }) {
  db.prepare('INSERT INTO wiki_pages (slug, title, content, sort_order) VALUES (?, ?, ?, ?)').run(
    slug,
    title,
    content,
    sort_order
  );
}

wipe();

// ---------- Brands ----------
const playstudios = insertBrand({
  name: 'Playstudios',
  description: 'Umbrella venture — everything else rolls up here.',
  color: '#1e293b',
});
const playissm = insertBrand({
  name: 'PLAYISSM',
  description: 'Parent brand — the ISSM methodology and the primary content platform.',
  color: '#7c3aed',
  parent_id: playstudios,
});
const kagami = insertBrand({
  name: 'Kagami',
  description: 'Product line — learning-in-practice tooling under the PLAYISSM methodology.',
  color: '#0d9488',
  parent_id: playissm,
});
const playsense = insertBrand({
  name: 'PlaySense',
  description: 'Product line — the neuroscience-of-play work under the PLAYISSM methodology.',
  color: '#db2777',
  parent_id: playissm,
});

// ---------- Pillars ----------
const pBuildInPublic = insertPillar({
  name: 'Build in Public',
  description: 'The company/product being built out loud — process, decisions, milestones.',
  color: '#f59e0b',
  brand_id: playstudios,
});
const pKagami = insertPillar({
  name: 'Kagami / Learning in Practice',
  description: 'How the Kagami methodology plays out in real learning contexts.',
  color: '#0d9488',
  brand_id: kagami,
});
const pMethodology = insertPillar({
  name: 'The Methodology',
  description: 'The ISSM framework itself — what it is, why it works, how to apply it.',
  color: '#7c3aed',
  brand_id: playissm,
});
const pFounderReality = insertPillar({
  name: 'Founder Reality',
  description: 'Unfiltered founder-voice content — the parts that do not make the highlight reel.',
  color: '#dc2626',
  brand_id: playissm,
});

// ---------- Platforms ----------
// cadence_days uses JS getDay() convention: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
const liCompany = insertPlatform({
  name: 'LinkedIn (Company)',
  account_type: 'Company Page',
  cadence_days: [2, 4],
  icon: '💼',
  color: '#0a66c2',
});
const liPersonal = insertPlatform({
  name: 'LinkedIn (Personal)',
  account_type: 'Personal Profile',
  cadence_days: [3, 5],
  icon: '👤',
  color: '#0a66c2',
});
const igBrand = insertPlatform({
  name: 'Instagram (Brand)',
  account_type: 'Brand Account',
  cadence_days: [2, 4, 6],
  icon: '📸',
  color: '#d62976',
});
const igPersonal = insertPlatform({
  name: 'Instagram (Personal)',
  account_type: 'Personal Account',
  cadence_days: [3, 5, 0],
  icon: '🌤️',
  color: '#d62976',
});
const substack = insertPlatform({
  name: 'Substack',
  account_type: 'Publication',
  cadence_days: [2, 4, 6],
  icon: '✉️',
  color: '#ff6719',
});
const youtube = insertPlatform({
  name: 'YouTube',
  account_type: 'Channel',
  cadence_days: [2],
  icon: '▶️',
  color: '#ff0000',
});
insertPlatform({
  name: 'Facebook',
  account_type: 'Page',
  cadence_days: [],
  icon: '👍',
  color: '#1877f2',
  active: 0,
});
insertPlatform({
  name: 'Spotify',
  account_type: 'Podcast',
  cadence_days: [],
  icon: '🎧',
  color: '#1db954',
  active: 0,
});

// ---------- Sequences ----------
const revealArc = insertSequence({
  name: 'LinkedIn Reveal Arc',
  description: 'The 4-post LinkedIn (Company) arc that introduces PLAYISSM publicly.',
  platform_id: liCompany,
});
const launchArc = insertSequence({
  name: 'Substack Launch Arc',
  description: '15 posts across 5 weeks (Tue teaser / Thu essay / Sat field note) launching the 5-essay series.',
  platform_id: substack,
});

// ---------- Hashtag library ----------
insertHashtagGroup({
  name: 'Build in Public — core set',
  pillar_id: pBuildInPublic,
  tags: ['#buildinpublic', '#startupjourney', '#foundermode', '#playstudios'],
});
insertHashtagGroup({
  name: 'Kagami — core set',
  pillar_id: pKagami,
  tags: ['#kagami', '#learningdesign', '#edtech', '#learninginpractice'],
});
insertHashtagGroup({
  name: 'Methodology — core set',
  pillar_id: pMethodology,
  tags: ['#issm', '#methodology', '#instructionaldesign', '#playissm'],
});
insertHashtagGroup({
  name: 'Founder Reality — core set',
  pillar_id: pFounderReality,
  tags: ['#founderreality', '#realtalk', '#startuplife', '#behindthebuild'],
});

// ---------- Wiki / reference pages ----------
insertWiki({
  slug: 'brand-architecture',
  title: 'Brand Architecture',
  sort_order: 1,
  content: `# Brand Architecture

**Playstudios** (umbrella)
  -> **PLAYISSM** (parent brand — the ISSM methodology + content platform)
       -> **Kagami** (learning-in-practice product line)
       -> **PlaySense** (neuroscience-of-play product line)

> PLACEHOLDER — replace with the locked positioning language for each layer
> (one paragraph per brand: who it's for, what it promises, how it differs
> from the others). Pull this from the strategy docs this tool is replacing.`,
});
insertWiki({
  slug: 'tagline',
  title: 'Tagline',
  sort_order: 2,
  content: `# Tagline

> PLACEHOLDER — paste the locked tagline(s) here. If there are
> variants per platform (e.g. a longer LinkedIn bio line vs. a short
> Instagram bio line), list each with its context.`,
});
insertWiki({
  slug: 'issm-definition',
  title: 'ISSM Definition',
  sort_order: 3,
  content: `# What ISSM Stands For

> PLACEHOLDER — lock the acronym expansion and the one-paragraph
> definition here:
>
> - I = ?
> - S = ?
> - S = ?
> - M = ?
>
> Follow with: why this framework, what problem it solves, and the
> one-sentence version you'd give someone in an elevator.`,
});
insertWiki({
  slug: 'playsense-neuro-trilogy',
  title: 'PlaySense Neuro Trilogy (Placeholder)',
  sort_order: 4,
  content: `# PlaySense Neuro Trilogy

> PLACEHOLDER — this product/content trilogy hasn't shipped yet.
> Use this page to park working titles, the neuroscience thesis each
> part is built on, and which pillar/platform each part will surface on
> once it's ready to move from "placeholder" to real content.`,
});
insertWiki({
  slug: 'posting-cadence',
  title: 'Posting Cadence & Rhythm',
  sort_order: 5,
  content: `# Locked Posting Rhythm

- **Monday** — planning day. No scheduled posts.
- **Tuesday** — LinkedIn (Company), Instagram (Brand), Substack, YouTube
- **Wednesday** — LinkedIn (Personal), Instagram (Personal)
- **Thursday** — LinkedIn (Company), Instagram (Brand), Substack
- **Friday** — LinkedIn (Personal), Instagram (Personal)
- **Saturday** — Instagram (Brand), Substack
- **Sunday** — Instagram (Personal)

All post times default to **11:00 AM Paris time** unless a post
explicitly overrides it.`,
});

// ---------- Posts: current + upcoming weeks, seeded from the locked plan ----------
// "This week" per the brief = Tue Jul 7 – Sun Jul 12, 2026.
const revealPost1 = insertPost({
  title: 'Reveal Post 1: Why We’re Building PLAYISSM in Public',
  platform_id: liCompany,
  pillar_id: pBuildInPublic,
  scheduled_date: '2026-07-07',
  status: 'Ready',
  sequence_id: revealArc,
  sequence_order: 1,
  hashtags: ['#buildinpublic', '#playissm', '#foundermode'],
  content_body: `We’ve been building something for the past year that we haven’t talked about publicly. Starting today, that changes.

PLAYISSM is the methodology behind how we design learning experiences — and over the next two weeks we’re going to show you exactly how it works, what it’s built on, and why we think the way most learning gets designed today skips a step that matters.

This is post one of four. No polish, no highlight reel — just the real build, in public.`,
  notes: 'Copy locked. Confirm final graphic before 11:00 Paris send.',
  checklist: ['Final copy approved by Neha', 'Header image exported', 'Schedule in LinkedIn'],
});

const revealPost2 = insertPost({
  title: 'Reveal Post 2: The Problem With How Learning Gets Measured',
  platform_id: liCompany,
  pillar_id: pMethodology,
  scheduled_date: '2026-07-09',
  status: 'Idea',
  sequence_id: revealArc,
  sequence_order: 2,
  hashtags: ['#issm', '#methodology', '#playissm'],
  content_body: '',
  checklist: ['Draft copy', 'Link back to Reveal Post 1', 'Neha review'],
});

insertPost({
  title: 'Reveal Post 3: Introducing Kagami',
  platform_id: liCompany,
  pillar_id: pKagami,
  scheduled_date: '2026-07-14',
  status: 'Idea',
  sequence_id: revealArc,
  sequence_order: 3,
  hashtags: ['#kagami', '#learningdesign'],
  checklist: ['Draft copy', 'Neha review'],
});

insertPost({
  title: 'Reveal Post 4: The Invitation',
  platform_id: liCompany,
  pillar_id: pBuildInPublic,
  scheduled_date: '2026-07-16',
  status: 'Idea',
  sequence_id: revealArc,
  sequence_order: 4,
  hashtags: ['#buildinpublic', '#playissm'],
  checklist: ['Draft copy', 'Decide on CTA', 'Neha review'],
});

// Substack Launch Arc — 5 essays across 5 weeks, Tue teaser / Thu essay / Sat field note.
const essays = [
  { title: 'The ISSM Method: Why Most Learning Design Skips a Step', pillar: pMethodology },
  { title: 'Kagami: Building a Mirror for Learning in Practice', pillar: pKagami },
  { title: 'The Founder Reality Behind a Methodology', pillar: pFounderReality },
  { title: 'PlaySense and the Neuroscience We Haven’t Shipped Yet', pillar: pMethodology },
  { title: 'Building in Public: What Twelve Weeks of Shipping Taught Us', pillar: pBuildInPublic },
];

const weekDates = [
  ['2026-07-07', '2026-07-09', '2026-07-11'],
  ['2026-07-14', '2026-07-16', '2026-07-18'],
  ['2026-07-21', '2026-07-23', '2026-07-25'],
  ['2026-07-28', '2026-07-30', '2026-08-01'],
  ['2026-08-04', '2026-08-06', '2026-08-08'],
];

let seqOrder = 1;
weekDates.forEach(([tue, thu, sat], weekIdx) => {
  const essay = essays[weekIdx];
  insertPost({
    title: `Launch Arc — Week ${weekIdx + 1} Teaser`,
    platform_id: substack,
    pillar_id: essay.pillar,
    scheduled_date: tue,
    status: weekIdx === 0 ? 'Idea' : 'Idea',
    sequence_id: launchArc,
    sequence_order: seqOrder++,
    checklist: ['Write teaser', 'Schedule'],
  });
  insertPost({
    title: `Essay ${weekIdx + 1}: ${essay.title}`,
    platform_id: substack,
    pillar_id: essay.pillar,
    scheduled_date: thu,
    status: weekIdx === 0 ? 'Drafting' : 'Idea',
    sequence_id: launchArc,
    sequence_order: seqOrder++,
    checklist: ['Draft essay', 'Edit pass', 'Neha review', 'Schedule'],
  });
  insertPost({
    title: `Launch Arc — Week ${weekIdx + 1} Field Note`,
    platform_id: substack,
    pillar_id: pBuildInPublic,
    scheduled_date: sat,
    status: 'Idea',
    sequence_id: launchArc,
    sequence_order: seqOrder++,
    checklist: ['Write field note', 'Schedule'],
  });
});

// Companion posts filling out this week's calendar on the other active platforms.
insertPost({
  title: 'Carousel: The ISSM Framework at a Glance',
  platform_id: igBrand,
  pillar_id: pMethodology,
  scheduled_date: '2026-07-07',
  status: 'Idea',
  checklist: ['Design carousel slides', 'Write caption', 'Schedule'],
});
insertPost({
  title: 'Build Companion Video: Behind the Reveal',
  platform_id: youtube,
  pillar_id: pBuildInPublic,
  scheduled_date: '2026-07-07',
  status: 'Idea',
  notes: 'Companions Reveal Post 1 — short cut for YouTube.',
  checklist: ['Rough cut', 'Captions', 'Thumbnail', 'Schedule'],
});
insertPost({
  title: 'Personal Note: What Today’s Reveal Cost Me',
  platform_id: liPersonal,
  pillar_id: pFounderReality,
  scheduled_date: '2026-07-08',
  status: 'Idea',
  checklist: ['Draft', 'Neha review'],
});
insertPost({
  title: 'Founder Reality: The Version Nobody Posts',
  platform_id: igPersonal,
  pillar_id: pFounderReality,
  scheduled_date: '2026-07-08',
  status: 'Idea',
  checklist: ['Write caption', 'Pick photo', 'Schedule'],
});
insertPost({
  title: 'Kagami in Practice: A Learning Loop, Visualized',
  platform_id: igBrand,
  pillar_id: pKagami,
  scheduled_date: '2026-07-09',
  status: 'Idea',
  checklist: ['Design graphic', 'Write caption', 'Schedule'],
});
insertPost({
  title: 'What I Got Wrong Building Kagami',
  platform_id: liPersonal,
  pillar_id: pFounderReality,
  scheduled_date: '2026-07-10',
  status: 'Idea',
  checklist: ['Draft', 'Neha review'],
});
insertPost({
  title: 'Friday Field Note',
  platform_id: igPersonal,
  pillar_id: pFounderReality,
  scheduled_date: '2026-07-10',
  status: 'Idea',
  checklist: ['Write caption', 'Schedule'],
});
insertPost({
  title: 'Weekend Build Companion: This Week in PLAYISSM',
  platform_id: igBrand,
  pillar_id: pBuildInPublic,
  scheduled_date: '2026-07-11',
  status: 'Idea',
  checklist: ['Design graphic', 'Write caption', 'Schedule'],
});
insertPost({
  title: 'Sunday Reset: Reading List + Reflections',
  platform_id: igPersonal,
  pillar_id: pFounderReality,
  scheduled_date: '2026-07-12',
  status: 'Idea',
  checklist: ['Write caption', 'Schedule'],
});

// Link the reveal posts to each other so the "related posts" feature has real data.
db.prepare(
  'INSERT INTO post_links (post_id, related_post_id, relation_label) VALUES (?, ?, ?)'
).run(revealPost2, revealPost1, 'Follows on from');

// ---------- Open cadence slots ----------
// Beyond the two named arcs, the regular weekly cadence goes blank after
// this week. Rather than leave future weeks empty, drop an unassigned
// "open slot" placeholder (no pillar, no content) on every cadence day
// that doesn't already have a post — Neha fills these in on planning day
// instead of creating slots from scratch. The client recognizes an empty
// pillar + empty body + Idea status as a fillable slot and styles it dashed.
const cadences = [
  { id: liCompany, name: 'LinkedIn (Company)', days: [2, 4] },
  { id: liPersonal, name: 'LinkedIn (Personal)', days: [3, 5] },
  { id: igBrand, name: 'Instagram (Brand)', days: [2, 4, 6] },
  { id: igPersonal, name: 'Instagram (Personal)', days: [3, 5, 0] },
  { id: substack, name: 'Substack', days: [2, 4, 6] },
  { id: youtube, name: 'YouTube', days: [2] },
];

const takenSlots = new Set(
  db
    .prepare('SELECT platform_id, scheduled_date FROM posts')
    .all()
    .map((r) => `${r.platform_id}|${r.scheduled_date}`)
);

const slotRangeStart = new Date(2026, 6, 13); // Mon Jul 13, 2026
const slotRangeEnd = new Date(2026, 7, 30); // Sun Aug 30, 2026
for (let d = new Date(slotRangeStart); d <= slotRangeEnd; d.setDate(d.getDate() + 1)) {
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const weekday = d.getDay();
  for (const platform of cadences) {
    if (!platform.days.includes(weekday)) continue;
    if (takenSlots.has(`${platform.id}|${iso}`)) continue;
    insertPost({
      title: `Open slot — ${platform.name}`,
      platform_id: platform.id,
      pillar_id: null,
      scheduled_date: iso,
      status: 'Idea',
      checklist: ['Decide topic', 'Draft', 'Schedule'],
    });
  }
}

console.log('Seed complete:');
console.log(` - ${db.prepare('SELECT COUNT(*) c FROM brands').get().c} brands`);
console.log(` - ${db.prepare('SELECT COUNT(*) c FROM pillars').get().c} pillars`);
console.log(` - ${db.prepare('SELECT COUNT(*) c FROM platforms').get().c} platforms`);
console.log(` - ${db.prepare('SELECT COUNT(*) c FROM sequences').get().c} sequences`);
console.log(` - ${db.prepare('SELECT COUNT(*) c FROM posts').get().c} posts`);
console.log(` - ${db.prepare('SELECT COUNT(*) c FROM hashtag_groups').get().c} hashtag groups`);
console.log(` - ${db.prepare('SELECT COUNT(*) c FROM wiki_pages').get().c} wiki pages`);

}

// Run directly (`node seed.js` / `npm run seed`) vs. imported by index.js
// for the first-boot auto-seed — only the CLI invocation logs/exits.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed();
}
