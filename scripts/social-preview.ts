/**
 * `bun scripts/social-preview.ts`: draws the card a link to the site shows when it is pasted
 * somewhere, `public/social-preview.png`, 1200 by 630. The card is the mark and the claim, set
 * in the site's own faces. Run it again when the claim changes.
 */
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const root = new URL('../', import.meta.url).pathname;

/**
 * A font file of a package as a data address, so the page needs no server.
 *
 * @param path - The file's path under `node_modules/@fontsource`.
 * @returns The address.
 */
function font(path: string): string {
  const bytes = readFileSync(`${root}node_modules/@fontsource/${path}`);
  return `data:font/woff2;base64,${bytes.toString('base64')}`;
}

const display = font('barlow-condensed/files/barlow-condensed-latin-600-normal.woff2');
const mono = font('jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2');
const page = `<!doctype html><html><head><style>
@font-face { font-family: Display; src: url(${display}); }
@font-face { font-family: Mono; src: url(${mono}); }
body { margin: 0; width: 1200px; height: 630px; display: flex; align-items: center; gap: 64px;
  padding: 0 80px; box-sizing: border-box; background: #f3ede4; color: #2b2b30; }
svg { flex: none; width: 300px; }
h1 { margin: 0; font: 600 92px/0.95 Display; text-transform: uppercase; }
em { font-style: normal; color: #e0543c; }
p { margin: 28px 0 0; font: 500 26px/1.3 Mono; color: #5f5c5a; }
</style></head><body>
<svg viewBox="40 60 320 280">
  <polygon points="60,72 340,72 254,144 146,144" fill="#2b2b30"/>
  <polygon points="48,84 134,156 134,244 48,316" fill="#2b2b30"/>
  <polygon points="60,328 340,328 254,256 146,256" fill="#e0543c"/>
  <polygon points="352,84 266,156 266,244 352,316" fill="#e0543c"/>
</svg>
<div><h1>Mattebox<br>HLS and DASH.<br><em>Half the weight.</em></h1>
<p>Open source player for the web · MIT</p></div>
</body></html>`;

const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await tab.setContent(page);
await tab.evaluate(() => document.fonts.ready);
await tab.screenshot({ path: `${root}public/social-preview.png` });
await browser.close();
process.stdout.write('Wrote public/social-preview.png.\n');
