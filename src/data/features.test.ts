import { expect, test } from 'bun:test';
import { books } from '../lib/books.ts';
import { featureGroups } from './features.ts';

const features = featureGroups.flatMap((group) => group.features);

test('every feature is provided by a book the site has', () => {
  const ids = new Set(books.map((book) => book.id));
  for (const feature of features) {
    for (const by of feature.by) expect(ids.has(by)).toBe(true);
  }
});

test("every feature's doc is a chapter of its book", () => {
  for (const feature of features) {
    const [bookId, slug] = feature.doc;
    const book = books.find((each) => each.id === bookId);
    expect(book?.chapters.some((chapter) => chapter.slug === slug)).toBe(true);
  }
});

test('no feature is listed twice', () => {
  const names = features.map((feature) => feature.name);
  expect(new Set(names).size).toBe(names.length);
});
