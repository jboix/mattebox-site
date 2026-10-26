/**
 * What Mattebox supports, as the Features page lists it. Each row names the deliverable that
 * provides the feature and the chapter that documents it, so a claim on the page is one click
 * from its proof.
 */

/** One supported feature. */
interface Feature {
  readonly name: string;
  /** One line on what it does, when the name does not say it. */
  readonly note?: string;
  /** The ids of the books whose deliverable provides it. */
  readonly by: readonly string[];
  /** The chapter that documents it: a book's id and a chapter's slug. */
  readonly doc: readonly [book: string, chapter: string];
}

/** A group of features. */
export interface FeatureGroup {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly features: readonly Feature[];
}

const engine = ['engine'] as const;
const player = ['player'] as const;

export const featureGroups: readonly FeatureGroup[] = [
  {
    id: 'protocols',
    title: 'Protocols and formats',
    summary: 'One engine reads HLS and DASH, in the containers streams are packaged in.',
    features: [
      { name: 'HLS with fragmented MP4 (CMAF)', by: engine, doc: ['engine', 'hls-and-dash'] },
      { name: 'DASH on demand and live', by: engine, doc: ['engine', 'hls-and-dash'] },
      {
        name: 'Multi-period DASH',
        note: 'Played as one presentation',
        by: engine,
        doc: ['engine', 'hls-and-dash'],
      },
      {
        name: 'HLS with MPEG-TS segments',
        note: 'Rewrapped as fragmented MP4 in a Worker',
        by: engine,
        doc: ['engine', 'legacy-transport-streams'],
      },
      {
        name: 'HEVC in MPEG-TS segments',
        note: 'Rewrapped as an hvc1 track',
        by: engine,
        doc: ['engine', 'legacy-transport-streams'],
      },
      {
        name: 'Packed audio (AAC with ID3)',
        by: engine,
        doc: ['engine', 'legacy-transport-streams'],
      },
      {
        name: 'AES-128 encrypted segments',
        by: engine,
        doc: ['engine', 'legacy-transport-streams'],
      },
      {
        name: 'Codecs read from the init segment',
        note: 'For a playlist that declares none',
        by: engine,
        doc: ['engine', 'legacy-transport-streams'],
      },
      {
        name: 'Native HLS in Safari',
        note: 'The player hands HLS to the browser where that is better',
        by: player,
        doc: ['player', 'the-element'],
      },
      {
        name: 'Progressive MP4 and MP3',
        note: "Through the browser's own playback",
        by: ['player-core', 'player'],
        doc: ['player-core', 'handlers'],
      },
      {
        name: 'Safari on iPhone and iPad',
        note: 'Through ManagedMediaSource, from iOS 17.1',
        by: engine,
        doc: ['engine', 'getting-started'],
      },
    ],
  },
  {
    id: 'live',
    title: 'Live',
    summary: 'Sliding windows, the live edge, and wall-clock time.',
    features: [
      { name: 'Live HLS and live DASH', by: engine, doc: ['engine', 'live-streaming'] },
      { name: 'DVR window and seeking back', by: engine, doc: ['engine', 'live-streaming'] },
      {
        name: 'Low-latency HLS',
        note: 'Parts, preload hints, blocking reloads and delta updates',
        by: engine,
        doc: ['engine', 'live-streaming'],
      },
      {
        name: 'Low-latency DASH',
        note: 'Early requests, and chunked segments appended as they arrive',
        by: engine,
        doc: ['engine', 'live-streaming'],
      },
      {
        name: 'Live catch-up',
        note: 'Playback speeds up or slows down to hold a target latency',
        by: engine,
        doc: ['engine', 'live-streaming'],
      },
      {
        name: 'Go to the live edge',
        by: [...engine, ...player],
        doc: ['engine', 'live-streaming'],
      },
      { name: 'Latency behind the live edge', by: engine, doc: ['engine', 'live-streaming'] },
      { name: 'Program date time', by: engine, doc: ['engine', 'live-streaming'] },
      {
        name: 'CMAF timing',
        note: "Lands a segment at its playlist time, whatever the packager's clock",
        by: engine,
        doc: ['engine', 'live-streaming'],
      },
    ],
  },
  {
    id: 'quality',
    title: 'Quality',
    summary: 'Adaptive bitrate you can constrain, pin, and read.',
    features: [
      {
        name: 'Adaptive bitrate',
        note: 'From throughput and buffer, with an emergency floor',
        by: engine,
        doc: ['engine', 'quality-and-abr'],
      },
      { name: "Cap to the player's size", by: engine, doc: ['engine', 'quality-and-abr'] },
      { name: 'Constraints and pins', by: engine, doc: ['engine', 'quality-and-abr'] },
      { name: 'Codec switching', by: engine, doc: ['engine', 'quality-and-abr'] },
      {
        name: 'Video tracks',
        note: 'Versions of the picture, such as a sign-language version, apart from the qualities',
        by: engine,
        doc: ['engine', 'audio-and-text'],
      },
      {
        name: 'Quality switch timing',
        note: 'At the next segment, soon, or now',
        by: engine,
        doc: ['engine', 'quality-and-abr'],
      },
      {
        name: 'HDR by capability',
        note: 'PQ and HLG only where the screen and decoder show them',
        by: engine,
        doc: ['engine', 'quality-and-abr'],
      },
      { name: 'Quality menu', by: player, doc: ['player', 'the-element'] },
      {
        name: 'Video menu',
        note: 'The versions in the manifest, and versions at their own URLs',
        by: player,
        doc: ['player', 'the-element'],
      },
    ],
  },
  {
    id: 'drm',
    title: 'DRM',
    summary: 'Every major key system, in the engine or on a native session.',
    features: [
      { name: 'Widevine', by: engine, doc: ['engine', 'drm'] },
      { name: 'PlayReady', by: engine, doc: ['engine', 'drm'] },
      { name: 'FairPlay', by: engine, doc: ['engine', 'drm'] },
      { name: 'ClearKey', by: engine, doc: ['engine', 'drm'] },
      { name: 'License renewal', by: engine, doc: ['engine', 'drm'] },
      {
        name: 'Your own license request',
        note: 'An async function in place of the built-in request',
        by: engine,
        doc: ['engine', 'drm'],
      },
      {
        name: 'License request retries',
        note: 'With the timeouts, delays and backoff you set',
        by: engine,
        doc: ['engine', 'drm'],
      },
      {
        name: 'Key sessions released on suspend',
        note: 'For a rights server that limits concurrent streams',
        by: engine,
        doc: ['engine', 'drm'],
      },
      {
        name: 'A license server per key system, and per source',
        by: engine,
        doc: ['engine', 'drm'],
      },
      {
        name: 'DRM without the engine',
        note: 'For a native HLS session in Safari',
        by: [...engine, ...player],
        doc: ['engine', 'drm'],
      },
      { name: 'DRM badge in the controls', by: player, doc: ['player', 'the-element'] },
    ],
  },
  {
    id: 'text',
    title: 'Subtitles and captions',
    summary: 'The formats broadcast and streaming both use.',
    features: [
      { name: 'WebVTT', by: engine, doc: ['engine', 'audio-and-text'] },
      { name: 'Segmented WebVTT', by: engine, doc: ['engine', 'audio-and-text'] },
      { name: 'TTML', by: engine, doc: ['engine', 'audio-and-text'] },
      {
        name: 'IMSC1 image subtitles',
        note: 'PNG subtitles, drawn over the video',
        by: engine,
        doc: ['engine', 'audio-and-text'],
      },
      { name: 'CEA-608 captions', by: engine, doc: ['engine', 'audio-and-text'] },
      { name: 'CEA-708 captions', by: engine, doc: ['engine', 'audio-and-text'] },
      { name: 'Forced subtitles', by: engine, doc: ['engine', 'audio-and-text'] },
      {
        name: 'Native text tracks',
        note: "In step with the browser's caption menu",
        by: engine,
        doc: ['engine', 'audio-and-text'],
      },
      {
        name: 'Subtitle size and background',
        note: 'Set by the viewer in the subtitles menu',
        by: player,
        doc: ['player', 'the-element'],
      },
    ],
  },
  {
    id: 'audio',
    title: 'Audio',
    summary: 'Alternate soundtracks, named for a menu.',
    features: [
      { name: 'Alternate audio', by: engine, doc: ['engine', 'audio-and-text'] },
      {
        name: 'Localized track names',
        note: 'From the HLS localization dictionary',
        by: engine,
        doc: ['engine', 'audio-and-text'],
      },
      {
        name: 'Audio description and SDH labels',
        by: [...engine, ...player],
        doc: ['engine', 'audio-and-text'],
      },
      {
        name: 'Channel layout of each track',
        note: 'For a label such as "English (5.1)"',
        by: engine,
        doc: ['engine', 'audio-and-text'],
      },
      { name: 'Audio menu', by: player, doc: ['player', 'the-element'] },
      { name: 'Audio-only sources', by: player, doc: ['player', 'the-element'] },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation in the content',
    summary: 'What a viewer scrubs, skips and jumps with.',
    features: [
      {
        name: 'Thumbnails',
        note: 'From the manifest or a WebVTT sprite track',
        by: [...engine, ...player],
        doc: ['engine', 'thumbnails'],
      },
      {
        name: 'Chapters',
        note: 'From the manifest, a file, or your own data',
        by: [...engine, ...player],
        doc: ['engine', 'chapters'],
      },
      {
        name: 'Trick play',
        note: 'Fast forward and rewind on the I-frame track',
        by: [...engine, ...player],
        doc: ['engine', 'trick-play'],
      },
      {
        name: 'Scrubbing',
        note: 'The picture shows the key frame under the pointer during a drag',
        by: [...engine, ...player],
        doc: ['engine', 'trick-play'],
      },
      {
        name: 'Frame previews from the stream',
        note: 'A key frame decoded from the I-frame track, for a stream with no thumbnails',
        by: [...engine, ...player],
        doc: ['engine', 'trick-play'],
      },
      {
        name: 'Timed metadata',
        note: 'Date ranges, DASH events, ID3, emsg, with an SCTE-35 summary',
        by: engine,
        doc: ['engine', 'audio-and-text'],
      },
      {
        name: 'Skip intro and credits',
        note: 'Markers on the seek bar and a button',
        by: player,
        doc: ['player', 'the-element'],
      },
      { name: 'Chapters menu', by: player, doc: ['player', 'the-element'] },
      {
        name: 'Skip back and forward buttons',
        note: 'By the seconds you set',
        by: player,
        doc: ['player', 'the-element'],
      },
      { name: 'Seek preview over the bar', by: player, doc: ['player', 'the-element'] },
    ],
  },
  {
    id: 'network',
    title: 'Network',
    summary: 'Hooks on every request, and the CDN standards.',
    features: [
      { name: 'Request and response hooks', by: engine, doc: ['engine', 'network-and-cdn'] },
      { name: 'Retries and recovery', by: engine, doc: ['engine', 'events-and-errors'] },
      {
        name: 'Stall recovery and gap jumping',
        note: 'Nudges the playhead, flushes and refetches, or jumps a small gap',
        by: engine,
        doc: ['engine', 'events-and-errors'],
      },
      {
        name: 'Suspend and resume',
        note: 'Stops every request while the source stays loaded',
        by: engine,
        doc: ['engine', 'getting-started'],
      },
      {
        name: 'CMCD',
        note: 'As a query argument or as headers',
        by: engine,
        doc: ['engine', 'network-and-cdn'],
      },
      { name: 'CMSD', by: engine, doc: ['engine', 'network-and-cdn'] },
      { name: 'Content steering', by: engine, doc: ['engine', 'network-and-cdn'] },
      {
        name: 'Preloading of the next source',
        note: 'The manifest, or its first segments too',
        by: engine,
        doc: ['engine', 'getting-started'],
      },
      {
        name: 'Several sources with fallback',
        by: ['player-core', 'player'],
        doc: ['player-core', 'handlers'],
      },
      {
        name: 'Source switch in place',
        note: 'Another URL of the same programme, with the last frame and the controls held',
        by: player,
        doc: ['player', 'the-element'],
      },
    ],
  },
  {
    id: 'controls',
    title: 'The player',
    summary: 'A custom element and the controls you place inside it.',
    features: [
      {
        name: 'A custom element, no framework',
        by: player,
        doc: ['player', 'getting-started'],
      },
      {
        name: 'Controls as elements you compose',
        note: 'Play, seek, volume, menus, time, title, spinner, error screen',
        by: player,
        doc: ['player', 'the-element'],
      },
      { name: 'Styling with parts and tokens', by: player, doc: ['player', 'the-element'] },
      { name: 'Labels in any language', by: player, doc: ['player', 'the-element'] },
      { name: 'Keyboard and media keys', by: player, doc: ['player', 'the-element'] },
      {
        name: 'Screen reader names',
        note: 'Every control has a name, and the sliders announce their value in words',
        by: player,
        doc: ['player', 'the-element'],
      },
      {
        name: 'Controls that hide by priority',
        note: 'On a narrow player the bar hides the least important first',
        by: player,
        doc: ['player', 'the-element'],
      },
      { name: 'Your own icons and controls', by: player, doc: ['player', 'the-element'] },
      {
        name: 'Size tiers',
        note: "A compact, a regular and a wide layout, from the player's own width",
        by: player,
        doc: ['player', 'the-element'],
      },
      { name: 'Fullscreen and picture in picture', by: player, doc: ['player', 'the-element'] },
      { name: 'AirPlay', by: player, doc: ['player', 'the-element'] },
      { name: 'Playback speed menu', by: player, doc: ['player', 'the-element'] },
      {
        name: 'A headless core',
        note: 'For a page that writes its own interface',
        by: ['player-core'],
        doc: ['player-core', 'handlers'],
      },
      { name: 'Script tags from a CDN', by: [...engine, ...player], doc: ['player', 'cdn'] },
    ],
  },
  {
    id: 'playlist',
    title: 'Playlist',
    summary: 'A list of items, from markup or from a script.',
    features: [
      {
        name: 'Next, previous, repeat and shuffle',
        by: ['playlist'],
        doc: ['playlist', 'playlist'],
      },
      { name: 'The list, over the picture', by: ['playlist'], doc: ['playlist', 'playlist'] },
      { name: 'Up next card with a countdown', by: ['playlist'], doc: ['playlist', 'playlist'] },
      { name: 'Preload of the next item', by: ['playlist'], doc: ['playlist', 'playlist'] },
      {
        name: 'Lock screen and media keys',
        note: 'Next and previous through the Media Session API',
        by: ['playlist'],
        doc: ['playlist', 'playlist'],
      },
      {
        name: 'A failed item is skipped',
        by: ['playlist'],
        doc: ['playlist', 'playlist'],
      },
    ],
  },
  {
    id: 'tv',
    title: 'TV and casting',
    summary: 'The living room: remotes, Chromecast, and 2021 TVs.',
    features: [
      {
        name: 'Samsung Tizen and LG webOS, from 2021 models',
        note: 'The floor is Chromium 76',
        by: [...engine, 'tv'],
        doc: ['tv', 'tv'],
      },
      { name: 'Remote control navigation', by: ['tv'], doc: ['tv', 'tv'] },
      {
        name: 'Seeking with the remote',
        note: 'The keys move a target, and Enter seeks to it',
        by: ['tv'],
        doc: ['tv', 'tv'],
      },
      { name: 'Chromecast sender', by: ['cast-sender'], doc: ['cast-sender', 'casting'] },
      {
        name: 'DRM and signed URLs on the Chromecast',
        note: 'The sender passes the license servers and headers, and a new token on a 401',
        by: ['cast-sender', 'cast-receiver'],
        doc: ['cast-sender', 'casting'],
      },
      {
        name: 'Chromecast receiver',
        note: "A bridge to Google's receiver framework, with hooks",
        by: ['cast-receiver'],
        doc: ['cast-receiver', 'getting-started'],
      },
    ],
  },
  {
    id: 'diagnostics',
    title: 'Diagnostics',
    summary: 'See what the player did, and send it to someone who can read it.',
    features: [
      { name: 'Stats and the engine trace', by: engine, doc: ['engine', 'diagnostics'] },
      { name: 'Replay of a recorded trace', by: engine, doc: ['engine', 'diagnostics'] },
      {
        name: 'Quality of experience metrics',
        note: 'Startup, rebuffering and switches, measured locally',
        by: engine,
        doc: ['engine', 'diagnostics'],
      },
      {
        name: 'A diagnostics panel in the player',
        note: 'Charts, engine state, browser support, and a report to copy',
        by: ['diagnostics'],
        doc: ['diagnostics', 'diagnostics'],
      },
      { name: 'Typed events and error codes', by: engine, doc: ['engine', 'events-and-errors'] },
    ],
  },
];

/** How many features the table lists. */
export const featureCount = featureGroups.reduce((sum, group) => sum + group.features.length, 0);
