import sitemap from '@astrojs/sitemap';
import { defineConfig, passthroughImageService } from 'astro/config';

// GitHub Pages serves the site under the repository's name. The workflow passes both.
const site = process.env.SITE_URL || 'https://jboix.github.io';
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  image: { service: passthroughImageService() },
  devToolbar: { enabled: false },
  integrations: [
    // An older version and `next` stand behind the latest release's page, their canonical.
    sitemap({ filter: (page) => !/\/404\/?$|\/docs\/[a-z-]+\/(next|v\d+\.\d+)\//.test(page) }),
  ],
  markdown: {
    syntaxHighlight: { type: 'shiki' },
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false },
  },
  vite: {
    // The engine's transmux Worker is an ES module of its own.
    worker: { format: 'es' },
  },
});
