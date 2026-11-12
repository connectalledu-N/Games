---
name: playissm-test
description: >-
  Tests a PLAYISSM product or the PLAYISSM website with the Founder skills
  (board, competitors, consumer panel, pricing, offer, CFO, marketing, brand,
  ops, launch, plan), already loaded with PLAYISSM's brand context. Targets:
  PLAYISSM (the umbrella and ISSM method), its verticals PlaySense, Kagami and
  PlayStudio, or any new offer. The
  website test reviews a live page as buyers would see it. Use when the user
  says "test Playissm", "test Kagami", "test PlaySense", "test PlayStudio", "test the website",
  "run the founder skills on Playissm", or "/playissm-test".
argument-hint: "[playissm | playsense | kagami | playstudio | website <url> | <new product>] [--quick | --full]"
---

# PLAYISSM test

Runs the Founder skills on one PLAYISSM product or the website, starting from
what is already known about PLAYISSM (`context.md` in this folder) so the user
does not re-explain the brand every time.

## 0. Pick the target and depth

Read `${CLAUDE_SKILL_DIR}/context.md` first.

From the arguments, or by asking once if missing, settle:

- **Target**: `playissm`, `playsense`, `kagami`, `playstudio`, `website <url>`
  (default https://www.playissm.com), or a new
  product (name it in a few words).
- **Depth**:
  - `--quick` (default): board → consumer panel `--quick` (20 buyers) → pricing
    → a one-page verdict. About 20 minutes.
  - `--full`: board → competitors → consumer panel (100) → pricing → offer →
    CFO → marketing → brand → ops → launch → plan.
  - Website targets always run the website test (section 3), then the quick
    chain on whatever the page is selling.

Anything in `context.md` marked PLACEHOLDER is unknown. Ask the user only for
the gaps the chosen steps need (for a quick run: who the buyer is, the price,
and how it is delivered). Never invent PLAYISSM facts; if the user does not
know, write "unknown" and say which result it weakens. Offer to save new
answers back into `context.md` so the next run does not ask again.

## 1. Set up the working folder

The Founder skills read and write `founder/` in the project root. Before
starting:

1. If `founder/` already exists, move it to `playissm-tests/_previous-<timestamp>/`
   so no earlier run is overwritten.
2. Write `founder/idea.md` from `context.md` plus the user's answers: the
   product, who it is for, the problem, how it is delivered, the price (or
   "unknown"), the stage, and how it fits the brand architecture
   (PLAYISSM umbrella → PlaySense / Kagami / PlayStudio). Use the vertical's own
   audience list from `context.md`, and say what it is not ("We are not").
   The original brand PDFs are in `${CLAUDE_SKILL_DIR}/docs/` if more detail is
   needed.

## 2. Run the chain

Call each Founder skill in order with the Skill tool (`founder-board`,
`founder-consumer`, ...), following its own instructions. Pass `--quick` to
`founder-consumer` on a quick run. Between steps, give the user one line on
what was found. Do not stop to ask permission between steps unless a skill
itself needs an answer.

## 3. Website test (website targets only)

1. Load the page: fetch it with WebFetch, or with Playwright (pre-installed;
   `require('playwright')`) when it needs JavaScript. Take a desktop and a phone
   screenshot (390px wide) into `founder/website/`.
2. Write `founder/website/page.md`: what a first-time visitor actually sees,
   above the fold and in full: the headline, the promise, the offer, the price,
   the calls to action, and the proof. Quote it; do not paraphrase.
3. Use `page.md` as the pitch for the consumer panel
   (`founder/pitch.md` = the page text), so the buyers react to the real site.
4. Write `founder/website/review.md`:
   - **Five-second test**: can a buyer say what it is, who it is for and what
     to do next? Answer from the panel's own words.
   - **Offer clarity**: run the `founder-offer` value equation on what the
     page states (not what PLAYISSM intends).
   - **Brand fit**: check the page against "Brand rules" in `context.md`
     (PLAYISSM in capitals, the standard description word for word, vertical
     names and descriptors, Crimson only on PLAYISSM, text in Indigo or Ink).
     Are PlaySense, Kagami and PlayStudio clearly told apart, and does each
     reach its own buyer?
   - **Friction**: broken links, slow or empty sections, phone layout
     problems, a missing price or call to action.
   - **Top 5 fixes**, ranked by how many simulated buyers each would flip, each
     with the exact wording or change to make.

## 4. Archive and report

Copy `founder/` to `playissm-tests/<target>-<YYYY-MM-DD>/` (add `-2`, `-3`
for repeat runs that day). Then give the user:

- the verdict in one line (from `founder-plan` on a full run; on a quick run:
  board vote + panel buy rate + recommended price),
- the three biggest risks and the three most valuable fixes,
- the facts that were "unknown" and which results they weaken,
- the archive path.

If an earlier run of the same target exists in `playissm-tests/`, compare:
what changed in the buy rate, the price and the board's vote.
