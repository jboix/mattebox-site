/** What a reader can open in a browser and use, with the book that documents each. */
import { hosted, repositories } from '../lib/site.ts';

/** One hosted page. */
export interface Tryable {
  readonly name: string;
  readonly what: string;
  readonly href: string;
  /** The repository the page is built from. */
  readonly source: string;
  /** The id of the book that documents it, when there is one. */
  readonly book?: string;
}

export const tryables: readonly Tryable[] = [
  {
    name: 'Player demo',
    what: 'The player with every control. Load your own stream, switch controls on and off, and copy the markup the page writes for you.',
    href: hosted.demo,
    source: repositories.player,
    book: 'player',
  },
  {
    name: 'Engine playground',
    what: 'The engine with nothing hidden: the event log, the buffer timeline, the manifest, network faults you can inject, and a stage list you can edit.',
    href: hosted.playground,
    source: repositories.engine,
    book: 'engine',
  },
  {
    name: 'Player editor',
    what: 'Restyle the player in the browser: a stylesheet, the markup, and a live preview side by side.',
    href: hosted.editor,
    source: repositories.editor,
  },
  {
    name: 'Playlist demo',
    what: 'A list of films with artwork, chapters and an up next card. Try repeat, shuffle and the list over the picture.',
    href: hosted.playlist,
    source: repositories.player,
    book: 'playlist',
  },
  {
    name: 'Reels demo',
    what: 'A feed of short clips, one player. The page measures how fast each clip starts with the next one preloaded.',
    href: hosted.reels,
    source: repositories.player,
    book: 'playlist',
  },
  {
    name: 'Cast receiver',
    what: "The receiver page a Chromecast loads, running under Google's real receiver framework in a desktop browser.",
    href: hosted.receiver,
    source: repositories.receiver,
    book: 'cast-receiver',
  },
];
