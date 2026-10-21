import sitemap from '@astrojs/sitemap';
import { defineConfig, passthroughImageService } from 'astro/config';
import { bundledThemes } from 'shiki/themes';

// The site is served from the root of mattebox.ch. The workflow passes both.
const site = process.env.SITE_URL || 'https://mattebox.ch';
const base = process.env.SITE_BASE || '/';

// GitHub's code colours sit on white. On the site's code background some fall under the 4.5:1
// of WCAG AA, so each of those is the nearest shade of its hue that reaches 4.6:1.
const githubLight = {
  ...(await bundledThemes['github-light']()).default,
  name: 'github-light',
  colorReplacements: {
    '#d73a49': '#b9323f',
    '#22863a': '#1d7432',
    '#e36209': '#a74807',
    '#6a737d': '#5e666f',
  },
};
const githubDark = {
  ...(await bundledThemes['github-dark']()).default,
  name: 'github-dark',
  colorReplacements: { '#6a737d': '#8e959c' },
};

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
    shikiConfig: { themes: { light: githubLight, dark: githubDark }, defaultColor: false },
  },
  vite: {
    // The engine's transmux Worker is an ES module of its own.
    worker: { format: 'es' },
  },
});
