/**
 * `bun run check:a11y`: runs axe-core over every built page, in the light and the dark theme, for
 * the WCAG 2.0, 2.1 and 2.2 rules at levels A and AA. Run after the build; it exits with an error
 * when a page breaks a rule. axe-core reaches into the player's shadow roots, so the home page's
 * player is checked with the page. Chromium runs it, one page at a time.
 */
import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { type Browser, chromium } from 'playwright';
import { dist, respond } from './serve.ts';

/** The rules axe-core runs: every WCAG A and AA rule up to WCAG 2.2. */
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** The themes a viewer can pick; contrast differs between them. */
const themes = ['light', 'dark'] as const;

/** What axe-core reports for a broken rule, the part this check prints. */
interface Violation {
  readonly id: string;
  readonly impact: string | null;
  readonly nodes: ReadonlyArray<{
    readonly target: readonly unknown[];
    readonly failureSummary?: string;
  }>;
}

/**
 * Lists the HTML pages under a directory, recursively, leaving out Pagefind's files.
 *
 * @param directory - The directory.
 * @returns The pages' paths.
 */
function pagesOf(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === 'pagefind' ? [] : pagesOf(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

/**
 * The broken rules of one page in one theme, one line per element.
 *
 * @param browser - The browser.
 * @param url - The page's address.
 * @param theme - The theme the system asks for.
 * @returns The problems.
 */
async function problemsOf(browser: Browser, url: string, theme: string): Promise<string[]> {
  const context = await browser.newContext({ colorScheme: theme as 'light' | 'dark' });
  try {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'load' });
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const violations = await page.evaluate(async (runOnly) => {
      const { axe } = window as unknown as {
        axe: { run(context: Document, options: unknown): Promise<{ violations: Violation[] }> };
      };
      const result = await axe.run(document, { runOnly: { type: 'tag', values: runOnly } });
      return result.violations;
    }, tags);
    return violations.flatMap((violation) =>
      violation.nodes.map((node) => {
        const summary = node.failureSummary?.split('\n').slice(1).join(' ').trim() ?? '';
        return `${violation.id} (${violation.impact}) ${node.target.join(' ')}: ${summary}`;
      }),
    );
  } finally {
    await context.close();
  }
}

const server = Bun.serve({ port: 0, fetch: respond });
const browser = await chromium.launch();
const failures: string[] = [];
try {
  for (const path of pagesOf(dist).sort()) {
    const address = `/${relative(dist, path)}`.replace(/index\.html$/, '');
    for (const theme of themes) {
      const problems = await problemsOf(browser, `${server.url.origin}${address}`, theme);
      for (const problem of problems) failures.push(`${address} [${theme}] ${problem}`);
    }
  }
} finally {
  await browser.close();
  server.stop(true);
}

if (failures.length > 0) {
  process.stderr.write(`${failures.join('\n')}\n${failures.length} accessibility problems.\n`);
  process.exit(1);
}
process.stdout.write('Every page passes axe-core in both themes.\n');
