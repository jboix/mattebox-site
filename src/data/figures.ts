/**
 * The screenshots the site adds to the guides. The chapters come from the product repositories
 * as text, and the pictures are taken here by `bun run screenshots`, from the hosted demos. A
 * figure names the chapter and the heading it follows, so it lands in every version that has
 * that heading and in no other.
 */

/** One screenshot in a chapter. */
export interface Figure {
  /** The book's id. */
  readonly book: string;
  /** The chapter's slug. */
  readonly chapter: string;
  /** The heading the picture follows, or nothing for the top of the chapter. */
  readonly after?: string;
  /** The picture's file under `public/guide/`. */
  readonly file: string;
  /** What the picture shows, for a reader who cannot see it. */
  readonly alt: string;
  /** The line under the picture. */
  readonly caption: string;
}

export const figures: readonly Figure[] = [
  {
    book: 'player',
    chapter: 'getting-started',
    file: 'player.jpg',
    alt: 'The Mattebox player with a title, a seek bar with chapter marks, and a row of controls.',
    caption: 'The player with its custom controls, as the demo composes them.',
  },
  {
    book: 'player',
    chapter: 'the-element',
    after: 'The controls',
    file: 'player-menu.jpg',
    alt: 'The quality menu open over the picture, listing Auto and five renditions.',
    caption: 'A menu opens over the picture and never leaves it.',
  },
  {
    book: 'player',
    chapter: 'the-element',
    after: 'Size tiers',
    file: 'player-compact.jpg',
    alt: 'The player on a phone: the title at the top, one time readout, and fewer controls.',
    caption: 'The compact tier, on a phone held upright.',
  },
  {
    book: 'playlist',
    chapter: 'playlist',
    after: 'The list',
    file: 'playlist.jpg',
    alt: 'The playlist over the right of the picture, with artwork, titles and lengths.',
    caption: 'The list a viewer opens from the bar.',
  },
  {
    book: 'engine',
    chapter: 'diagnostics',
    after: 'The playground',
    file: 'playground.jpg',
    alt: 'The engine playground: a video, its transport, and tabs for the stream, quality and diagnostics.',
    caption: 'The hosted playground.',
  },
  {
    book: 'cast-receiver',
    chapter: 'getting-started',
    file: 'receiver.jpg',
    alt: 'The cast receiver page running in a desktop browser.',
    caption: "The receiver page, under Google's receiver framework in a desktop browser.",
  },
];
