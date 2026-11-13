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
  /**
   * The chapter that documents it: a book's id, a chapter's slug, and the heading of the section
   * that covers it, when one does. The build's link check fails when the heading is not there.
   */
  readonly doc: readonly [book: string, chapter: string, section?: string];
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
      {
        name: 'HLS with fragmented MP4 (CMAF)',
        by: engine,
        doc: ['engine', 'hls-and-dash', 'Segment formats'],
      },
      {
        name: 'DASH on demand and live',
        by: engine,
        doc: ['engine', 'hls-and-dash', 'Protocol adapters'],
      },
      {
        name: 'Multi-period DASH',
        note: 'Played as one presentation',
        by: engine,
        doc: ['engine', 'hls-and-dash', 'Multi-period MPDs'],
      },
      {
        name: 'HLS with MPEG-TS segments',
        note: 'Rewrapped as fragmented MP4 in a Worker',
        by: engine,
        doc: ['engine', 'legacy-transport-streams', 'Container stages'],
      },
      {
        name: 'HEVC in MPEG-TS segments',
        note: 'Rewrapped as an hvc1 track',
        by: engine,
        doc: ['engine', 'legacy-transport-streams', 'HEVC'],
      },
      {
        name: 'Packed audio (AAC with ID3)',
        by: engine,
        doc: ['engine', 'legacy-transport-streams', 'Container stages'],
      },
      {
        name: 'AES-128 encrypted segments',
        by: engine,
        doc: ['engine', 'legacy-transport-streams', 'The aes-128 stage'],
      },
      {
        name: 'Codec detection from the init segment',
        note: 'For a playlist that declares none',
        by: engine,
        doc: ['engine', 'legacy-transport-streams', 'The codec-probe stage'],
      },
      {
        name: 'Native HLS in Safari',
        note: 'The player hands HLS to the browser where that is better',
        by: player,
        doc: ['player', 'the-element', 'Native HLS in Safari'],
      },
      {
        name: 'Progressive MP4 and MP3',
        note: "Through the browser's own playback",
        by: ['player-core', 'player'],
        doc: ['player-core', 'handlers', 'The two handlers'],
      },
      {
        name: 'Safari on iPhone and iPad',
        note: 'Through ManagedMediaSource, from iOS 17.1',
        by: engine,
        doc: ['engine', 'getting-started', 'Requirements'],
      },
    ],
  },
  {
    id: 'live',
    title: 'Live',
    summary: 'Sliding windows, the live edge, and wall-clock time.',
    features: [
      {
        name: 'Live HLS and live DASH',
        by: engine,
        doc: ['engine', 'live-streaming', 'Live adapters'],
      },
      { name: 'DVR window', by: engine, doc: ['engine', 'live-streaming', 'engine.live'] },
      {
        name: 'Low-latency HLS',
        note: 'Parts, preload hints, blocking reloads and delta updates',
        by: engine,
        doc: ['engine', 'live-streaming', 'Low-latency HLS'],
      },
      {
        name: 'Low-latency DASH',
        note: 'Early requests, and chunked segments appended as they arrive',
        by: engine,
        doc: ['engine', 'live-streaming', 'Low-latency DASH'],
      },
      {
        name: 'Live catch-up',
        note: 'Playback speeds up or slows down to hold a target latency',
        by: engine,
        doc: ['engine', 'live-streaming', 'Live catch-up'],
      },
      {
        name: 'Jump to live',
        by: [...engine, ...player],
        doc: ['engine', 'live-streaming', 'engine.live'],
      },
      {
        name: 'Live latency measurement',
        by: engine,
        doc: ['engine', 'live-streaming', 'engine.live'],
      },
      { name: 'Program date time', by: engine, doc: ['engine', 'live-streaming', 'The pdt stage'] },
      {
        name: 'CMAF timing',
        note: "Lands a segment at its playlist time, whatever the packager's clock",
        by: engine,
        doc: ['engine', 'live-streaming', 'The cmaf-timing stage'],
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
        doc: ['engine', 'quality-and-abr', 'The abr stage'],
      },
      {
        name: "Quality capped to the player's size",
        by: engine,
        doc: ['engine', 'quality-and-abr', 'The abr stage'],
      },
      {
        name: 'Quality constraints and pins',
        by: engine,
        doc: ['engine', 'quality-and-abr', 'Constraints'],
      },
      {
        name: 'Codec switching',
        by: engine,
        doc: ['engine', 'quality-and-abr', 'The codec-switch stage'],
      },
      {
        name: 'Video tracks',
        note: 'Versions of the picture, such as a sign-language version, apart from the qualities',
        by: engine,
        doc: ['engine', 'audio-and-text', 'Video tracks'],
      },
      {
        name: 'Quality switch timing',
        note: 'At the next segment, soon, or now',
        by: engine,
        doc: ['engine', 'quality-and-abr', 'How selection works'],
      },
      {
        name: 'HDR by capability',
        note: 'PQ and HLG only where the screen and decoder show them',
        by: engine,
        doc: ['engine', 'quality-and-abr', 'The hdr stage'],
      },
      { name: 'Quality menu', by: player, doc: ['player', 'the-element', 'The elements'] },
      {
        name: 'Video menu',
        note: 'The versions in the manifest, and versions at their own URLs',
        by: player,
        doc: ['player', 'the-element', 'Versions of the picture'],
      },
    ],
  },
  {
    id: 'drm',
    title: 'DRM',
    summary: 'Every major key system, in the engine or on a native session.',
    features: [
      { name: 'Widevine', by: engine, doc: ['engine', 'drm', 'EME stages'] },
      { name: 'PlayReady', by: engine, doc: ['engine', 'drm', 'EME stages'] },
      { name: 'FairPlay', by: engine, doc: ['engine', 'drm', 'FairPlay'] },
      { name: 'ClearKey', by: engine, doc: ['engine', 'drm', 'ClearKey'] },
      { name: 'License renewal', by: engine, doc: ['engine', 'drm', 'License renewal'] },
      {
        name: 'Custom license requests',
        note: 'An async function in place of the built-in request',
        by: engine,
        doc: ['engine', 'drm', 'Your own license request'],
      },
      {
        name: 'License request retries',
        note: 'With the timeouts, delays and backoff you set',
        by: engine,
        doc: ['engine', 'drm', 'Retries'],
      },
      {
        name: 'Concurrent stream limits',
        note: 'Key sessions are released on suspend, for a rights server that counts streams',
        by: engine,
        doc: ['engine', 'drm', 'Release on suspend'],
      },
      {
        name: 'License servers per key system and source',
        by: engine,
        doc: ['engine', 'drm', 'License servers'],
      },
      {
        name: 'DRM for native HLS',
        note: 'For a native HLS session in Safari',
        by: [...engine, ...player],
        doc: ['engine', 'drm', 'DRM without the engine'],
      },
      {
        name: 'DRM badge in the controls',
        by: player,
        doc: ['player', 'the-element', 'The elements'],
      },
    ],
  },
  {
    id: 'text',
    title: 'Subtitles and captions',
    summary: 'The formats broadcast and streaming both use.',
    features: [
      { name: 'WebVTT', by: engine, doc: ['engine', 'audio-and-text', 'WebVTT subtitles'] },
      {
        name: 'Segmented WebVTT',
        by: engine,
        doc: ['engine', 'audio-and-text', 'WebVTT subtitles'],
      },
      { name: 'TTML', by: engine, doc: ['engine', 'audio-and-text', 'TTML subtitles'] },
      {
        name: 'IMSC1 image subtitles',
        note: 'PNG subtitles, drawn over the video',
        by: engine,
        doc: ['engine', 'audio-and-text', 'Image subtitles'],
      },
      {
        name: 'CEA-608 captions',
        by: engine,
        doc: ['engine', 'audio-and-text', 'CEA-608 captions'],
      },
      {
        name: 'CEA-708 captions',
        by: engine,
        doc: ['engine', 'audio-and-text', 'CEA-708 captions'],
      },
      {
        name: 'Forced subtitles',
        by: engine,
        doc: ['engine', 'audio-and-text', 'Forced subtitles'],
      },
      {
        name: 'Native text tracks',
        note: "In step with the browser's caption menu",
        by: engine,
        doc: ['engine', 'audio-and-text', 'engine.tracks'],
      },
      {
        name: 'Subtitle size and background',
        note: 'Set by the viewer in the subtitles menu',
        by: player,
        doc: ['player', 'the-element', 'The elements'],
      },
    ],
  },
  {
    id: 'audio',
    title: 'Audio',
    summary: 'Alternate soundtracks, named for a menu.',
    features: [
      {
        name: 'Alternate audio',
        by: engine,
        doc: ['engine', 'audio-and-text', 'The alt-audio stage'],
      },
      {
        name: 'Localized track names',
        note: 'From the HLS localization dictionary',
        by: engine,
        doc: ['engine', 'audio-and-text', 'Track names'],
      },
      {
        name: 'Audio description and SDH labels',
        by: [...engine, ...player],
        doc: ['engine', 'audio-and-text', 'Track names'],
      },
      {
        name: 'Channel layout of each track',
        note: 'For a label such as "English (5.1)"',
        by: engine,
        doc: ['engine', 'audio-and-text', 'engine.tracks'],
      },
      { name: 'Audio menu', by: player, doc: ['player', 'the-element', 'The elements'] },
      { name: 'Audio-only sources', by: player, doc: ['player', 'the-element', 'Attributes'] },
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
        doc: ['engine', 'thumbnails', 'Sources'],
      },
      {
        name: 'Chapters',
        note: 'From the manifest, a file, or your own data',
        by: [...engine, ...player],
        doc: ['engine', 'chapters', 'engine.chapters'],
      },
      {
        name: 'Trick play',
        note: 'Fast forward and rewind on the I-frame track',
        by: [...engine, ...player],
        doc: ['engine', 'trick-play', 'engine.trick'],
      },
      {
        name: 'Scrubbing',
        note: 'The picture shows the key frame under the pointer during a drag',
        by: [...engine, ...player],
        doc: ['engine', 'trick-play', 'Scrubbing'],
      },
      {
        name: 'Frame previews from the stream',
        note: 'A key frame decoded from the I-frame track, for a stream with no thumbnails',
        by: [...engine, ...player],
        doc: ['engine', 'trick-play', 'Frame previews'],
      },
      {
        name: 'Timed metadata',
        note: 'Date ranges, DASH events, ID3, emsg, with an SCTE-35 summary',
        by: engine,
        doc: ['engine', 'audio-and-text', 'Timed metadata'],
      },
      {
        name: 'Skip intro and credits',
        note: 'Markers on the seek bar and a button',
        by: player,
        doc: ['player', 'blocks-and-markers', 'Markers'],
      },
      {
        name: 'Blocked ranges',
        note: 'Playback moves past them, and the seek bar says why',
        by: player,
        doc: ['player', 'blocks-and-markers', 'Blocks'],
      },
      { name: 'Chapters menu', by: player, doc: ['player', 'the-element', 'The elements'] },
      {
        name: 'Skip back and forward buttons',
        note: 'By the seconds you set',
        by: player,
        doc: ['player', 'the-element', 'The elements'],
      },
      {
        name: 'Seek preview over the bar',
        by: player,
        doc: ['player', 'the-element', 'Native controls'],
      },
    ],
  },
  {
    id: 'network',
    title: 'Network',
    summary: 'Hooks on every request, and the CDN standards.',
    features: [
      {
        name: 'Request and response hooks',
        by: engine,
        doc: ['engine', 'network-and-cdn', 'Transport options'],
      },
      {
        name: 'Retries and recovery',
        by: engine,
        doc: ['engine', 'events-and-errors', 'The recovery stage'],
      },
      {
        name: 'Stall recovery and gap jumping',
        note: 'Nudges the playhead, flushes and refetches, or jumps a small gap',
        by: engine,
        doc: ['engine', 'events-and-errors', 'The recovery stage'],
      },
      {
        name: 'Suspend and resume',
        note: 'Stops every request while the source stays loaded',
        by: engine,
        doc: ['engine', 'getting-started', 'Suspend and resume'],
      },
      {
        name: 'CMCD',
        note: 'As a query argument or as headers',
        by: engine,
        doc: ['engine', 'network-and-cdn', 'The cmcd stage'],
      },
      { name: 'CMSD', by: engine, doc: ['engine', 'network-and-cdn', 'The cmsd stage'] },
      {
        name: 'Content steering',
        by: engine,
        doc: ['engine', 'network-and-cdn', 'The content-steering stage'],
      },
      {
        name: 'Preloading of the next source',
        note: 'The manifest, or its first segments too',
        by: engine,
        doc: ['engine', 'getting-started', 'Preload the next source'],
      },
      {
        name: 'Source fallback',
        by: ['player-core', 'player'],
        doc: ['player', 'fallback-and-versions', 'Fallback'],
      },
      {
        name: 'Source switch in place',
        note: 'Another URL of the same programme, with the last frame and the controls held',
        by: player,
        doc: ['player', 'fallback-and-versions', 'Versions of the picture'],
      },
    ],
  },
  {
    id: 'controls',
    title: 'The player',
    summary: 'A custom element and the controls you place inside it.',
    features: [
      {
        name: 'Framework-free custom element',
        by: player,
        doc: ['player', 'getting-started', 'The element'],
      },
      {
        name: 'Composable controls',
        note: 'Play, seek, volume, menus, time, title, spinner, error screen',
        by: player,
        doc: ['player', 'the-element', 'Import only what you use'],
      },
      {
        name: 'Styling with parts and tokens',
        by: player,
        doc: ['player', 'the-element', 'Styling'],
      },
      { name: 'Labels in any language', by: player, doc: ['player', 'the-element', 'Labels'] },
      {
        name: 'Controls in 12 languages',
        note: "Each loaded only when a player shows it, following the page's lang",
        by: player,
        doc: ['player', 'languages', 'Register a language'],
      },
      {
        name: 'Blocked content messages',
        note: "A geoblock or an age rule, in the viewer's language, over the picture",
        by: player,
        doc: ['player', 'blocks-and-markers', 'Blocks'],
      },
      {
        name: 'Persistent viewer preferences',
        note: 'Tracks, volume, rate, quality and subtitle look',
        by: ['preferences'],
        doc: ['preferences', 'preferences', 'The store'],
      },
      { name: 'Keyboard and media keys', by: player, doc: ['player', 'the-element', 'The bar'] },
      {
        name: 'Screen reader support',
        note: 'Every control has a name, and the sliders announce their value in words',
        by: player,
        doc: ['player', 'the-element', 'Labels'],
      },
      {
        name: 'Responsive control bar',
        note: 'On a narrow player the bar hides the least important first',
        by: player,
        doc: ['player', 'the-element', 'The bar'],
      },
      {
        name: 'Custom icons and controls',
        by: player,
        doc: ['player', 'the-element', 'A control of your own'],
      },
      {
        name: 'Layouts by player width',
        note: "A compact, a regular and a wide layout, from the player's own width",
        by: player,
        doc: ['player', 'the-element', 'Size tiers'],
      },
      {
        name: 'Fullscreen and picture in picture',
        by: player,
        doc: ['player', 'the-element', 'The elements'],
      },
      { name: 'AirPlay', by: player, doc: ['player', 'the-element', 'Casting'] },
      { name: 'Playback speed menu', by: player, doc: ['player', 'the-element', 'The elements'] },
      {
        name: 'Headless core',
        note: 'For a page that writes its own interface',
        by: ['player-core'],
        doc: ['player-core', 'handlers', 'The chain'],
      },
      { name: 'CDN script tags', by: [...engine, ...player], doc: ['player', 'cdn', 'Two tags'] },
    ],
  },
  {
    id: 'connectors',
    title: 'Your content and your analytics',
    summary:
      'You load a programme by its id or its data, and you add the trackers your page needs.',
    features: [
      {
        name: 'Content API connectors',
        note: 'A programme id in src, which your connector resolves to what plays',
        by: ['player-core', 'player'],
        doc: ['player-core', 'connectors', 'A connector'],
      },
      {
        name: 'Preloaded programme data',
        note: 'Resolved without a fetch, from your cache, your server or a fixture',
        by: ['player-core', 'player'],
        doc: ['player-core', 'connectors', 'Load with data you already have'],
      },
      {
        name: 'Next programme resolved ahead',
        note: 'A preload or the playlist resolves it, so its start asks your API nothing',
        by: ['player-core', 'playlist'],
        doc: ['player-core', 'connectors', 'Preload the next programme'],
      },
      {
        name: 'Metadata from your API',
        note: 'Title, poster, chapters and markers',
        by: player,
        doc: ['player-core', 'connectors', 'A connector'],
      },
      {
        name: 'Analytics trackers',
        note: 'The player starts and stops them at each programme; your page decides when',
        by: player,
        doc: ['player', 'trackers', 'A tracker'],
      },
      {
        name: 'Session and device IDs',
        note: 'Shown in the diagnostics panel and its report',
        by: ['player', 'diagnostics'],
        doc: ['player', 'trackers', 'Session and device ids'],
      },
    ],
  },
  {
    id: 'ads',
    title: 'Ads',
    summary: 'The breaks your stream signals, and the ads your ad server returns.',
    features: [
      {
        name: 'HLS interstitials',
        note: 'Pre-, mid- and post-rolls, asset lists, and the skip and jump rules',
        by: [...engine, 'ads'],
        doc: ['engine', 'interstitials', 'What the stage reads'],
      },
      {
        name: 'DASH alternative MPD',
        note: 'Insert and replace, and List MPDs with their callback beacons',
        by: [...engine, 'ads'],
        doc: ['engine', 'interstitials', 'What the stage reads'],
      },
      {
        name: 'SCTE-35 breaks',
        note: 'From HLS tags, DASH events and emsg boxes',
        by: [...engine, 'ads'],
        doc: ['engine', 'interstitials', 'What a SCTE-35 span is'],
      },
      {
        name: 'Promos, credits and chapters from SCTE-35',
        note: 'Promos show as promos, credits give Skip intro and Skip credits',
        by: [...engine, 'ads'],
        doc: ['ads', 'ads', 'A break the stream plays itself'],
      },
      {
        name: 'SVTA2053 ad creatives',
        note: 'The beacons, skip and click of ads stitched into the stream',
        by: [...engine, 'ads'],
        doc: ['engine', 'interstitials', 'What the stage reads'],
      },
      {
        name: 'VAST 2 to 4.3',
        note: "Wrappers, pods and skip offsets; HLS, DASH and MP4 ads on the player's own video",
        by: ['ads'],
        doc: ['ads', 'ads', 'Where the ads come from'],
      },
      {
        name: 'VMAP 1.0.1',
        note: 'Pre-, mid- and post-rolls from one schedule',
        by: ['ads'],
        doc: ['ads', 'ads', 'Where the ads come from'],
      },
      {
        name: 'Scheduled ad breaks',
        note: 'From your own ad decisions, with a VAST or a stream for each',
        by: ['ads'],
        doc: ['ads', 'ads', 'Where the ads come from'],
      },
      {
        name: 'Ad decisions for live cue-outs',
        note: 'A VAST for each SCTE-35 break',
        by: ['ads'],
        doc: ['ads', 'ads', 'A break the stream plays itself'],
      },
      {
        name: 'Ad beacons',
        note: 'Impressions, quartiles, clicks, errors and viewability, with the VAST macros',
        by: ['ads'],
        doc: ['ads', 'ads', 'Beacons'],
      },
      {
        name: 'Ad controls in 12 languages',
        note: "The label, the skip button, the progress and the advertiser's link",
        by: ['ads'],
        doc: ['ads', 'ads', 'Words'],
      },
      {
        name: 'Ad breaks on the seek bar',
        by: [...player, 'ads'],
        doc: ['ads', 'ads', 'While an ad plays'],
      },
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
        doc: ['playlist', 'playlist', 'What plays next'],
      },
      { name: 'Playlist panel', by: ['playlist'], doc: ['playlist', 'playlist', 'The list'] },
      {
        name: 'Up next card with a countdown',
        by: ['playlist'],
        doc: ['playlist', 'playlist', 'The up next card'],
      },
      {
        name: 'Next item preload',
        by: ['playlist'],
        doc: ['playlist', 'playlist', 'What plays next'],
      },
      {
        name: 'Lock screen and media keys',
        note: 'Next and previous through the Media Session API',
        by: ['playlist'],
        doc: ['playlist', 'playlist', 'From a script'],
      },
      {
        name: 'Failed items skipped',
        by: ['playlist'],
        doc: ['playlist', 'playlist', 'What plays next'],
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
        doc: ['tv', 'tv', 'Which TVs'],
      },
      { name: 'Remote control navigation', by: ['tv'], doc: ['tv', 'tv', 'Moving focus'] },
      {
        name: 'Remote seeking',
        note: 'The keys move a target, and Enter seeks to it',
        by: ['tv'],
        doc: ['tv', 'tv', 'Seeking with the remote'],
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
        doc: ['cast-receiver', 'getting-started', 'The receiver'],
      },
    ],
  },
  {
    id: 'diagnostics',
    title: 'Diagnostics',
    summary: 'See what the player did, and send it to someone who can read it.',
    features: [
      { name: 'Stats and the engine trace', by: engine, doc: ['engine', 'diagnostics', 'Stats'] },
      { name: 'Trace replay', by: engine, doc: ['engine', 'diagnostics', 'Replay'] },
      {
        name: 'Quality of experience metrics',
        note: 'Startup, rebuffering and switches, measured locally',
        by: engine,
        doc: ['engine', 'diagnostics', 'QoE metrics'],
      },
      {
        name: 'A diagnostics panel in the player',
        note: 'Charts, engine state, browser support, and a report to copy',
        by: ['diagnostics'],
        doc: ['diagnostics', 'diagnostics', 'In the bar'],
      },
      {
        name: 'Typed events and error codes',
        by: engine,
        doc: ['engine', 'events-and-errors', 'Errors'],
      },
    ],
  },
];

/** How many features the table lists. */
export const featureCount = featureGroups.reduce((sum, group) => sum + group.features.length, 0);
