import { expect, describe as group, test } from 'bun:test';
import {
  describe,
  headingId,
  headingIds,
  rewriteAddresses,
  sectionOf,
  splitTitle,
  withInserts,
} from './markdown.ts';

group('splitTitle', () => {
  test('takes the first heading as the title, without the chapter number', () => {
    expect(splitTitle('# 03 HLS and DASH\n\nOne engine.\n', 'x')).toEqual({
      title: 'HLS and DASH',
      body: 'One engine.\n',
    });
  });

  test('falls back for a file without a title', () => {
    expect(splitTitle('Plain.\n', 'Casting')).toEqual({ title: 'Casting', body: 'Plain.\n' });
  });
});

group('sectionOf', () => {
  const file = '# T\n\n## A\n\na\n\n### Casting\n\nc\n\n#### Deep\n\nd\n\n### Labels\n\nl\n';

  test('keeps what sits under the heading, and moves its headings up', () => {
    expect(sectionOf(file, 'Casting')).toBe('c\n\n## Deep\n\nd');
  });

  test('answers nothing for a heading the file does not have', () => {
    expect(sectionOf(file, 'Missing')).toBeUndefined();
  });

  test('does not read a heading inside fenced code', () => {
    expect(sectionOf('## X\n\n```md\n## Casting\n```\n', 'Casting')).toBeUndefined();
  });
});

group('headings', () => {
  test('makes the id GitHub makes', () => {
    expect(headingId('The `abr` stage')).toBe('the-abr-stage');
    expect(headingId("What's next?")).toBe('whats-next');
  });

  test('lists the ids of a chapter', () => {
    expect([...headingIds('## One\n\n```\n## Not\n```\n\n### Two words\n')]).toEqual([
      'one',
      'two-words',
    ]);
  });
});

group('describe', () => {
  test('is the first paragraph of prose, as plain text', () => {
    expect(describe('| a |\n\nRead the [guide](x.md) for `load`.\n\nMore.')).toBe(
      'Read the guide for load.',
    );
  });

  test('cuts a long paragraph at a word', () => {
    const long = describe(`${'word '.repeat(60)}`);
    expect(long.length).toBeLessThanOrEqual(155);
    expect(long.endsWith('...')).toBe(true);
  });
});

group('rewriteAddresses', () => {
  const upper = (url: string, image: boolean) => ({ url: `${image ? 'IMG:' : ''}${url}!` });

  test('rewrites links, images, definitions and raw HTML', () => {
    const text = 'A [b](c.md#d "t") and ![e](f.png).\n[ref]: g.md\n<img src="h.svg">';
    expect(rewriteAddresses(text, upper)).toBe(
      'A [b](c.md#d! "t") and ![e](IMG:f.png!).\n[ref]: g.md!\n<img src="IMG:h.svg!">',
    );
  });

  test('leaves fenced code as written', () => {
    const text = '```md\n[b](c.md)\n```';
    expect(rewriteAddresses(text, upper)).toBe(text);
  });

  test('writes an image with a class as HTML', () => {
    const scheme = () => ({ url: '/a.svg', className: 'on-light' });
    expect(rewriteAddresses('![Size](a.svg#gh-light-mode-only)', scheme)).toBe(
      '<img src="/a.svg" alt="Size" class="on-light" />',
    );
  });
});

group('withInserts', () => {
  test('adds a picture at the top and under its heading', () => {
    const body = 'Intro.\n\n## The list\n\nText.';
    const inserts = [{ html: '<A>' }, { after: 'The list', html: '<B>' }];
    expect(withInserts(body, inserts)).toBe('<A>\n\nIntro.\n\n## The list\n\n<B>\n\nText.');
  });

  test('leaves out a picture whose heading the chapter lacks', () => {
    expect(withInserts('## Other\n', [{ after: 'The list', html: '<B>' }])).toBe('## Other\n');
  });
});
