# Personal website

Hub for my online presence, built with [Astro](https://astro.build) and deployed to GitHub Pages.

- `src/data/site.ts`: name, title, tagline, bio, social links, Substack feed. Update with the `/update-copy` skill.
- `src/data/career.ts`: the timeline, synced from LinkedIn with the `/update-timeline` skill. Logos go in `public/logos/`.

Latest Substack posts are read from the RSS feed at build time; the deploy workflow also rebuilds daily so new posts appear without a commit.

```sh
npm install
npm run dev
```

**Deploy:** in the GitHub repo, go to Settings → Pages → Source and choose "GitHub Actions". Pushing to `main` deploys.
