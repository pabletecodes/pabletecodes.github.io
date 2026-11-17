// @ts-check
import { defineConfig } from 'astro/config';

// On GitHub Pages, SITE and BASE are set by the deploy workflow.
// A user site (<user>.github.io) or custom domain uses base "/".
export default defineConfig({
  site: process.env.SITE ?? 'http://localhost:4321',
  base: process.env.BASE ?? '/',
});
