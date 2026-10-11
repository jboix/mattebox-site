import { describe, expect, test } from 'bun:test';
import { bookVersions, pickReleases } from './versions.ts';

describe('pickReleases', () => {
  const tags = [
    'v0.12.0',
    'v0.12.1',
    'v0.13.0',
    'v0.14.0',
    'v0.9.0',
    'v0.11.0',
    '@mattebox/player-v0.8.0',
    'v0.15.0-beta.1',
  ];

  test('keeps the latest patch of each minor, the newest three', () => {
    expect(pickReleases(tags, 'v')).toEqual([
      { id: 'v0.14', tag: 'v0.14.0', version: '0.14.0' },
      { id: 'v0.13', tag: 'v0.13.0', version: '0.13.0' },
      { id: 'v0.12', tag: 'v0.12.1', version: '0.12.1' },
    ]);
  });

  test("reads a scoped package's tags, and no other package's", () => {
    const scoped = ['@mattebox/player-v0.8.0', '@mattebox/player-core-v0.5.0', 'v0.14.0'];
    expect(pickReleases(scoped, '@mattebox/player-v').map((release) => release.tag)).toEqual([
      '@mattebox/player-v0.8.0',
    ]);
  });

  test('orders a major above every minor before it', () => {
    const ids = pickReleases(['v0.14.0', 'v1.0.0', 'v1.1.2', 'v0.13.0'], 'v').map(
      (release) => release.id,
    );
    expect(ids).toEqual(['v1.1', 'v1.0', 'v0.14']);
  });
});

describe('bookVersions', () => {
  test('puts the newest release at the home of the book, and next beside it', () => {
    const versions = bookVersions('engine', pickReleases(['v0.13.0', 'v0.14.0'], 'v'), '0.14.0');
    expect(versions.map((version) => [version.id, version.path, version.latest])).toEqual([
      ['next', 'docs/engine/next/', false],
      ['v0.14', 'docs/engine/', true],
      ['v0.13', 'docs/engine/v0.13/', false],
    ]);
  });

  test('gives the home to next while the book has no release', () => {
    const [next] = bookVersions('playlist', [], '0.0.0');
    expect(next).toMatchObject({ id: 'next', path: 'docs/playlist/', latest: true, next: true });
  });
});
