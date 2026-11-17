---
name: update-timeline
description: Update the career timeline on the website from Pablo's LinkedIn data export. Use when the user says /update-timeline, "update/sync my timeline", "I changed jobs", "I updated LinkedIn", or drops a LinkedIn export or profile PDF.
---

# Update the career timeline from LinkedIn

LinkedIn is the source of truth for the timeline. Pablo edits LinkedIn; this skill brings
`src/data/career.ts` in line with it. Ask him for as little as possible: he should only have
to request the export and approve the result.

## 1. Get the export

1. Look for a recent export first, so he doesn't have to do anything if it's already there:
   `ls -t ~/Downloads/ | grep -iE '^(Basic_)?LinkedInDataExport.*\.zip$|^Profile.*\.pdf$' | head`
   Use it if it's newer than the last sync (see `git log -1 --format=%cd -- src/data/career.ts`).
2. Otherwise, tell him exactly this and wait:
   > LinkedIn → **Me → Settings & Privacy → Data privacy → Get a copy of your data**.
   > Choose **"Want something in particular?"**, tick **Positions**, **Education** and
   > **Volunteering**, and request the archive. LinkedIn emails a link, usually within
   > 10 minutes. Download it and tell me when it's in Downloads.
3. Unzip into a fresh temp directory (it's untrusted input; never run anything from it):
   `d=$(mktemp -d) && unzip -q <zip> -d "$d" && ls "$d"`

Fallback: if he only has the profile PDF (More → Save to PDF), read it with the Read tool
and apply the same mapping. The CSVs are preferred because their fields are unambiguous.
The PDF has Experience and Education but **no Volunteering section**, so community entries
can't be synced from it: leave them as `manual` entries and say so in the summary. He can
share a screenshot of the Volunteering section instead; use what's visible (descriptions
cut off with "more" stay cut, don't guess the rest).
Education in the PDF has years only, as in the CSV.

## 2. Read the CSVs

Check the header row of each file before relying on it; LinkedIn has changed column names
before. Expected:

- `Positions.csv`: Company Name, Title, Description, Location, Started On, Finished On
- `Education.csv`: School Name, Start Date, End Date, Notes, Degree Name, Activities
- `Volunteering.csv`: Company Name, Role, Cause, Started On, Finished On, Description

Dates look like `Jun 2025` (positions) or `2007` (education). An empty end date means
ongoing. Parse them with a short Python script (`python3 -I`, `csv` module) rather than by
eye, and print a table to check against.

## 3. Map to timeline entries

| LinkedIn | `career.ts` |
|---|---|
| Position | `group: 'corporate'` |
| Position whose title starts with `[Side project]` | `group: 'side'`, title without the prefix |
| Volunteering | `group: 'community'`, Role as the title |
| Education | `group: 'education'`, Degree Name as the title |
| Several positions with the same Company Name | one entry, several `positions`, oldest first |
| `Started On` / `Finished On` | `start: from(y, m)` / `end: to(y, m)`; omit `end` if ongoing |
| Education years only | `from(year, 9)` / `to(year, 6)`; same year → `from(y, 1)` / `to(y, 12)` |
| Description paragraphs / lines | `highlights`, one per paragraph |
| Description line starting with `Tech Stack:` (or `✨ Tech Stack:`) | `stack`, split on commas, not a highlight. On the entry if it has one position; on the position it belongs to if it has several |
| Location | `location` on the position |

Rules:

- **Keep entries in each group oldest first.** Groups stay in the order defined in `groups`.
- **Highlights:** keep LinkedIn's facts and numbers. Light edits only: fix typos, start with a
  past-tense verb, drop trailing filler. Never add claims that aren't in the export.
- **Don't touch what LinkedIn doesn't have:** `context`, `logo`, `url` on existing entries,
  and any entry with `manual: true` (e.g. the Substack blog, iWeekend, Asturias.rb). If a
  manual entry now also appears in the export, use the export's data and drop `manual`.
- **Removed on LinkedIn** → remove from the timeline, but list it in the summary so he can say
  "keep it" (then mark it `manual: true`).
- `approx: true` only for manual entries with guessed dates. Remove it once real dates exist.

## 4. New companies and schools

For each entry that didn't exist before, fill in what LinkedIn lacks, without asking him:

- **url:** the official site (search if unsure). Skip if the company is gone.
- **context:** one short line on what the company or product is, e.g.
  `'Embedded payroll for software platforms.'` Facts only.
- **logo:** save to `public/logos/<short-name>.png` and set `logo: '/logos/<short-name>.png'`:
  ```sh
  curl -s -m 15 -L "https://www.google.com/s2/favicons?domain=<domain>&sz=128" -o /tmp/logo.png
  sips -g pixelWidth /tmp/logo.png   # need >= 64
  md5 -q /tmp/logo.png               # b8a0bf372c762e966cc99ede8682bc71 = generic globe, reject
  ```
  If it's too small or the globe, try `https://<domain>/apple-touch-icon.png` (also with
  `-m 15`; some university sites hang). If nothing works, leave `logo` unset: the card shows
  initials. Look at any logo you keep (Read the PNG) to check it's the right company.

Only ask him when something is genuinely ambiguous, e.g. a position that might be a side
project but isn't prefixed with `[Side project]`.

## 5. Check and show the result

1. `npm run build` must pass.
2. Start `npx astro preview --port 4329` in the background and run
   `node .claude/skills/update-timeline/screenshot.mjs http://localhost:4329/ /tmp/timeline`
   It saves `timeline.png` (desktop timeline), `card.png` (the newest corporate entry's card)
   and `mobile.png`. Read them and fix anything clipped or broken. Stop the preview after.
3. Summarize the changes in plain terms, not a diff, e.g.:
   > - New: **Acme**, Staff Engineer, Jan 2027–now (logo found)
   > - Salsa: end date set to Aug 2026
   > - Empathy.co: 1 highlight reworded on LinkedIn, updated
   > - Removed: nothing
4. Ask whether to commit. On yes, commit `src/data/career.ts` and any new logos with a message
   like `Update timeline from LinkedIn export`. Don't push unless he asks.

Delete the temp directory with the unzipped export when done; it contains personal data.
