/**
 * The configurations the size article walks through. Each step points at a row of the player's
 * stack chart and says what that row adds; the build fails when the chart measured something
 * else. Every chain starts from the player alone, so the player's own size is on the page.
 */
import type { Step } from '../lib/stacks.ts';

/** A configuration built up step by step. */
interface Chain {
  readonly id: string;
  readonly title: string;
  readonly intro: string;
  readonly steps: readonly Step[];
}

/** The import specifier of each package, by the stack chart's word for it. */
export const packageSpecifiers: Readonly<Record<string, string>> = {
  'live-captions': '@mattebox/player-live-captions',
  cast: '@mattebox/player-cast',
  '360': '@mattebox/player-360',
};

/** The player with no stage, which every chain starts from. */
const player: Step = { row: 'Player alone', label: 'Player' };

export const chains: readonly Chain[] = [
  {
    id: 'hls',
    title: 'HLS with live, subtitles, Chromecast and DRM',
    intro:
      'The player first, then HLS with fMP4 segments on demand, then one addition per row. Stop at the row that covers your streams.',
    steps: [
      player,
      { row: '+ HLS on demand', stages: ['protocols/hls-cmaf', 'stages/abr'] },
      { row: '+ live', stages: ['protocols/hls-live'] },
      { row: '+ subtitles', stages: ['stages/text-webvtt', 'stages/text-webvtt-segmented'] },
      { row: '+ live captions', packages: ['live-captions'] },
      { row: '+ Chromecast', packages: ['cast'] },
      {
        row: '+ Widevine, FairPlay',
        stages: ['stages/eme-core', 'stages/eme-cenc', 'stages/eme-fairplay'],
      },
    ],
  },
  {
    id: 'dash-360',
    title: 'DASH with 360° video',
    intro: 'The player first, then DASH on demand, then the 360° view.',
    steps: [
      player,
      {
        row: 'Player + DASH on demand',
        label: '+ DASH on demand',
        stages: ['protocols/dash-cmaf', 'stages/abr'],
      },
      { row: '+ 360° video', packages: ['360'] },
    ],
  },
];
