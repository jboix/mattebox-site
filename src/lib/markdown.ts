/**
 * Text-level work on a chapter's Markdown, done once when the docs are collected: the title, the
 * description, one section of a file, and every link and image address. Pure functions.
 */

/** A chapter's title and what follows it. */
export interface Titled {
  readonly title: string;
  readonly body: string;
}

/** What a link or an image address becomes. */
export interface Rewritten {
  readonly url: string;
  /** A class for the image, when its address said which colour scheme it is for. */
  readonly className?: string;
}

/** Decides the new address of a link or an image. */
export type Rewrite = (url: string, image: boolean) => Rewritten;

const fence = /^(\s*)(`{3,}|~{3,})/;

/**
 * Runs a function over the lines outside fenced code, and leaves the code as written.
 *
 * @param text - The Markdown.
 * @param change - What to do with a line of prose.
 * @returns The Markdown with its prose lines changed.
 */
function overProse(text: string, change: (line: string) => string): string {
  let open: string | undefined;
  return text
    .split('\n')
    .map((line) => {
      const mark = fence.exec(line)?.[2];
      if (open !== undefined) {
        if (mark?.startsWith(open)) open = undefined;
        return line;
      }
      if (mark !== undefined) {
        open = mark;
        return line;
      }
      return change(line);
    })
    .join('\n');
}

/**
 * Splits a chapter into its title and its body. The title is the first level-one heading,
 * without the chapter number a guide file carries.
 *
 * @param text - The Markdown.
 * @param fallback - The title of a file without a level-one heading.
 * @returns The title and the rest.
 */
export function splitTitle(text: string, fallback: string): Titled {
  const match = /^# +(.+)$/m.exec(text);
  if (match === null) return { title: fallback, body: text };
  const title = (match[1] ?? fallback).replace(/^\d+\s+/, '').trim();
  const body = `${text.slice(0, match.index)}${text.slice(match.index + match[0].length)}`;
  return { title, body: body.replace(/^\n+/, '') };
}

/**
 * The heading's level and text, for a heading line.
 *
 * @param line - A line.
 * @returns The level and the text, or nothing for another line.
 */
function headingOf(line: string): { level: number; text: string } | undefined {
  const match = /^(#{1,6}) +(.+?)\s*#*$/.exec(line);
  if (match === null) return undefined;
  return { level: (match[1] ?? '').length, text: (match[2] ?? '').trim() };
}

/**
 * One section of a file: what sits under a heading, up to the next heading of its level or
 * above. The headings inside move up, so the first level below the section becomes level two.
 *
 * @param text - The Markdown.
 * @param heading - The heading's text.
 * @returns The section without its own heading, or nothing when the file has no such heading.
 */
export function sectionOf(text: string, heading: string): string | undefined {
  const kept: string[] = [];
  let level = 0;
  let open: string | undefined;
  for (const line of text.split('\n')) {
    const mark = fence.exec(line)?.[2];
    if (open !== undefined) {
      if (mark?.startsWith(open)) open = undefined;
    } else if (mark !== undefined) open = mark;
    const found = open === undefined && mark === undefined ? headingOf(line) : undefined;
    if (level === 0) {
      if (found?.text === heading) level = found.level;
      continue;
    }
    if (found !== undefined && found.level <= level) break;
    kept.push(found === undefined ? line : `${'#'.repeat(found.level - level + 1)} ${found.text}`);
  }
  return level === 0 ? undefined : kept.join('\n').trim();
}

/**
 * The id GitHub and Astro give a heading.
 *
 * @param text - The heading's text.
 * @returns The id.
 */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s/g, '-');
}

/**
 * The ids of every heading of a chapter.
 *
 * @param text - The Markdown.
 * @returns The ids.
 */
export function headingIds(text: string): Set<string> {
  const ids = new Set<string>();
  overProse(text, (line) => {
    const found = headingOf(line);
    if (found !== undefined) ids.add(headingId(found.text));
    return line;
  });
  return ids;
}

/**
 * A description for a chapter: its first paragraph of prose, as plain text, cut to a length a
 * search result shows.
 *
 * @param body - The chapter without its title.
 * @returns The description.
 */
export function describe(body: string): string {
  const paragraphs = body.split(/\n\s*\n/).map((each) => each.trim());
  const prose = paragraphs.find((each) => /^[\p{L}`"(]/u.test(each) && !each.startsWith('```'));
  const plain = (prose ?? '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= 155) return plain;
  return `${plain.slice(0, 152).replace(/\s+\S*$/, '')}...`;
}

/**
 * The HTML of an image whose address named a colour scheme, since Markdown has no class.
 *
 * @param alt - The image's text.
 * @param rewritten - The new address and the class.
 * @returns The tag.
 */
function imageTag(alt: string, rewritten: Rewritten): string {
  const text = alt.replace(/"/g, '&quot;');
  return `<img src="${rewritten.url}" alt="${text}" class="${rewritten.className}" />`;
}

/**
 * Rewrites every link and image address of a chapter: inline links and images, reference
 * definitions, and the `src` and `href` of raw HTML. Fenced code is left as written.
 *
 * @param text - The Markdown.
 * @param rewrite - What an address becomes.
 * @returns The Markdown with its addresses rewritten.
 */
export function rewriteAddresses(text: string, rewrite: Rewrite): string {
  return overProse(text, (line) =>
    line
      .replace(
        /(!?)\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g,
        (_all, bang, label, url, title) => {
          const rewritten = rewrite(url, bang === '!');
          if (bang === '!' && rewritten.className !== undefined) return imageTag(label, rewritten);
          return `${bang}[${label}](${rewritten.url}${title})`;
        },
      )
      .replace(/^(\[[^\]]+\]:\s*)(\S+)/, (_all, head, url) => `${head}${rewrite(url, false).url}`)
      .replace(/\b(src|href)="([^"]+)"/g, (_all, name, url) => {
        return `${name}="${rewrite(url, name === 'src').url}"`;
      }),
  );
}

/** A picture to add to a chapter. */
export interface Insert {
  /** The heading the picture follows, or nothing for the top of the chapter. */
  readonly after?: string;
  /** The HTML to add. */
  readonly html: string;
}

/**
 * Adds pictures to a chapter: at its top, or under a heading. A picture whose heading the
 * chapter does not have is left out, which is how an older version skips what it lacks.
 *
 * @param body - The chapter without its title.
 * @param inserts - The pictures.
 * @returns The chapter with the pictures in.
 */
export function withInserts(body: string, inserts: readonly Insert[]): string {
  const lead = inserts.filter((each) => each.after === undefined).map((each) => each.html);
  const under = overProse(body, (line) => {
    const found = headingOf(line);
    const added = inserts.filter((each) => found !== undefined && each.after === found.text);
    return [line, ...added.map((each) => `\n${each.html}`)].join('\n');
  });
  return lead.length === 0 ? under : `${lead.join('\n\n')}\n\n${under}`;
}
