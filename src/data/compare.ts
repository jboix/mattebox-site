/**
 * The comparison with other players. Every cell is a fact with a source a reader can check: a
 * project's own licence file, or a size the product repositories measure with one script. The
 * commercial players' prices are theirs to state, so the table only says that there is one.
 */

/** A player in the comparison. */
export interface Compared {
  readonly name: string;
  /** The licence, as the project states it. */
  readonly licence: string;
  /** Whether the code is open source. */
  readonly open: boolean;
  /** What using it in production costs. */
  readonly price: string;
  readonly hls: boolean;
  readonly dash: boolean;
  /** Whether it comes with a player interface, or is an engine alone. */
  readonly interface: string;
  /** Where the licence can be read. */
  readonly source: string;
}

export const compared: readonly Compared[] = [
  {
    name: 'Mattebox',
    licence: 'MIT',
    open: true,
    price: 'Free',
    hls: true,
    dash: true,
    interface: 'Yes, a package of its own',
    source: 'https://github.com/jboix/mattebox/blob/main/LICENSE',
  },
  {
    name: 'hls.js',
    licence: 'Apache-2.0',
    open: true,
    price: 'Free',
    hls: true,
    dash: false,
    interface: 'No',
    source: 'https://github.com/video-dev/hls.js/blob/master/LICENSE',
  },
  {
    name: 'dash.js',
    licence: 'BSD-3-Clause',
    open: true,
    price: 'Free',
    hls: false,
    dash: true,
    interface: 'No',
    source: 'https://github.com/Dash-Industry-Forum/dash.js/blob/development/LICENSE.md',
  },
  {
    name: 'Shaka Player',
    licence: 'Apache-2.0',
    open: true,
    price: 'Free',
    hls: true,
    dash: true,
    interface: 'Yes, in the ui build',
    source: 'https://github.com/shaka-project/shaka-player/blob/main/LICENSE',
  },
  {
    name: 'video.js',
    licence: 'Apache-2.0',
    open: true,
    price: 'Free',
    hls: true,
    dash: true,
    interface: 'Yes',
    source: 'https://github.com/videojs/video.js/blob/main/LICENSE',
  },
  {
    name: 'Bitmovin Player',
    licence: 'Commercial',
    open: false,
    price: 'A paid licence',
    hls: true,
    dash: true,
    interface: 'Yes',
    source: 'https://bitmovin.com/pricing/',
  },
  {
    name: 'THEOplayer (Dolby OptiView)',
    licence: 'Commercial',
    open: false,
    price: 'A paid licence',
    hls: true,
    dash: true,
    interface: 'Yes',
    source: 'https://optiview.dolby.com/pricing/',
  },
];

/** When the comparison was last checked against its sources. */
export const comparedOn = '2026-10-11';
