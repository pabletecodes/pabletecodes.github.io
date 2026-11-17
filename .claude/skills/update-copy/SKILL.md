---
name: update-copy
description: Interview Pablo to sharpen the website's title, tagline and short bio, then update them. Use when he says /update-copy, "rewrite my bio", "update my tagline/headline", "my positioning changed", or wants help with the site's intro copy.
---

# Update the site copy by grilling Pablo first

The copy lives in `src/data/site.ts`:

| Field | Where it shows | Constraint |
|---|---|---|
| `title` | Browser tab, search results, link previews | ≤ 60 characters, usually `Pablo Alonso · <role>` |
| `tagline` | Under his name; also the meta description | One sentence, ≤ 80 characters |
| `bio` | The intro paragraphs | 2–3 short paragraphs, ≤ 90 words in total |

`name` is the page heading; leave it alone unless he asks.

The goal is copy that's specific to him, not a better-sounding version of what's there.
**Don't write anything until the interview is done and he has approved the brief.**

## 1. Prepare (silently)

- Read `src/data/site.ts` for the current copy.
- Read his positioning in Notion if the Notion tools are available: the page
  "Construir mi marca personal" (`3f037542f8a5800da0a4d0da88439e54`). It has his topic,
  angle, content pillars and LinkedIn headline. It's in Spanish; the site is in English.
- Skim `src/data/career.ts` for proof points: years, companies, what he shipped, the
  engineer ↔ PM moves, the side projects.

## 2. Grill him

Ask **one question at a time** and wait for the answer. He can answer in Spanish or English,
in rough notes. Keep each question short.

Cover these, in roughly this order, skipping anything his notes already answer clearly:

1. **Who is the reader?** Who should land here and think "this is the person I need"?
   (A hiring manager? A founder looking for a contractor? Other engineers reading his posts?)
2. **What should they do next?** Read a post, subscribe, contact him, look at his work?
3. **What's changed** since the current copy was written, if anything?
4. **The one-line claim:** if they remember one thing, what is it?
5. **Proof:** what in his history backs that claim up? Push for specifics: a number, a
   product, a decision he made.
6. **What makes him different** from other senior engineers using AI?
7. **Tone:** how should it sound? (Plain and direct, playful, understated...) Is there a
   bio he likes and wants to sound closer to?
8. **What to leave out:** anything that's true but he doesn't want to lead with.

How to grill:

- **Push back on vague answers.** "Passionate about quality", "builds great products",
  "AI-native" are things anyone could say. Ask what he actually did, for whom, with what result.
- **Point out tension** between his answers and his positioning or history, e.g. a claim
  his timeline doesn't support yet, or two audiences that need different copy.
- **Ask follow-ups** when an answer opens something useful, but keep the whole interview to
  about 8–12 questions. Don't re-ask what he's answered.
- Offer a hypothesis when he's stuck: "It sounds like the claim is X. Right, or close?"

## 3. Confirm the brief

Before writing, summarize in a few lines and ask him to confirm or correct:

> **Reader:** … · **Action:** … · **Claim:** … · **Proof:** … · **Tone:** … · **Avoid:** …

## 4. Draft

Write the copy in English, first person, plain words, no buzzwords or hype. Every claim
should trace back to something he said or to `career.ts`. Never invent numbers, clients
or results.

Show **2 options for the tagline** and **one bio** (plus the title), with the current
version next to them and a one-line reason for each choice. Ask which he prefers and what
to change. Iterate until he says it's good. Keep revisions small and specific.

## 5. Apply and check

1. Update only `title`, `tagline` and `bio` in `src/data/site.ts`.
2. `npm run build` must pass.
3. Start `npx astro preview --port 4329` in the background and take a screenshot of the top
   of the page, desktop and mobile:
   ```sh
   chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
   profile=$(mktemp -d)
   "$chrome" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$profile" --window-size=1280,800 --screenshot=/tmp/copy-desktop.png http://localhost:4329/
   "$chrome" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$profile" --window-size=500,900 --screenshot=/tmp/copy-mobile.png http://localhost:4329/
   ```
   Read both and check the copy fits (no awkward wraps, tagline not too long). Stop the preview.
4. Show him the final copy and ask whether to commit. On yes, commit `src/data/site.ts`
   with a message like `Update site copy`. Don't push unless he asks.

If the interview changes how he describes himself, mention places that may now be out of
date (his LinkedIn headline, the Notion positioning page), but don't edit them yourself.
