/**
 * Builds the search index of the docs, after the build. The index holds the latest release of
 * every book: only those pages mark their article for it, so a search never returns an older
 * version of a page.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { close, createIndex } from 'pagefind';

/** The built site. */
const dist = new URL('../dist/', import.meta.url).pathname;

/**
 * The HTML pages under a folder, recursively.
 *
 * @param directory - The folder.
 * @returns The pages' paths.
 */
function pagesOf(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return pagesOf(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

const { index } = await createIndex({});
if (!index) throw new Error('No search index.');
let count = 0;
for (const page of pagesOf(join(dist, 'docs'))) {
  const content = readFileSync(page, 'utf8');
  if (!content.includes('data-pagefind-body')) continue;
  const url = `/${relative(dist, page).replace(/(^|\/)index\.html$/, '$1')}`;
  await index.addHTMLFile({ url, content });
  count += 1;
}
await index.writeFiles({ outputPath: join(dist, 'pagefind') });
await close();
process.stdout.write(`Indexed ${count} pages of the docs.\n`);
