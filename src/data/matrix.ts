/**
 * The feature matrix of the comparison: the features of Mattebox that other players are asked
 * about, and what each of those players states about them. Every cell of another player links to
 * where its project states the fact: its docs, its README, or its source at a tag. A cell no
 * project states is "unstated", never a guess. Mattebox's cells link to its own docs, through the
 * feature each row names.
 *
 * Checked on {@link matrixCheckedOn}. Regenerate the cells by checking each project again; do not
 * edit one without its source.
 */

/** What a project states about a feature. */
export type Support = 'yes' | 'partial' | 'no' | 'unstated';

/** One player's answer for one feature. */
interface Cell {
  readonly support: Support;
  /** What the answer covers, when it is not the whole feature. */
  readonly note?: string;
  /** Where the project states it. Every cell but an unstated one has one. */
  readonly source?: string;
}

/** A player the matrix compares with. */
export interface Rival {
  readonly id: RivalId;
  readonly name: string;
  /** The version the sources describe. */
  readonly version: string;
  /** The row of the player chart that measures it. */
  readonly chartLabel: string;
}

/** The players compared. */
export type RivalId = 'shaka' | 'videojs' | 'bitmovin' | 'theoplayer';

/** One row: a feature, as Mattebox lists it, and each other player's answer. */
interface MatrixRow {
  readonly label: string;
  /** The name of the feature in `features.ts`, which gives Mattebox's cell its link. */
  readonly feature: string;
  readonly cells: Readonly<Record<RivalId, Cell>>;
}

/** A group of rows. */
export interface MatrixGroup {
  readonly title: string;
  readonly rows: readonly MatrixRow[];
}

/** When the cells were last checked against their sources. */
export const matrixCheckedOn = '2026-11-13';

export const rivals: readonly Rival[] = [
  { id: 'shaka', name: 'Shaka Player', version: '5.3.0', chartLabel: 'shaka player + ui' },
  {
    id: 'videojs',
    name: 'video.js 10',
    version: '10.4.0',
    chartLabel: 'video.js 10 + hls.js + dash.js',
  },
  { id: 'bitmovin', name: 'Bitmovin Player', version: '8.279.0', chartLabel: 'bitmovin player' },
  { id: 'theoplayer', name: 'THEOplayer', version: '11.13.0', chartLabel: 'theoplayer' },
];

export const matrix: readonly MatrixGroup[] = [
  {
    title: 'Protocols',
    rows: [
      {
        label: 'HLS, fMP4 segments',
        feature: 'HLS with fragmented MP4 (CMAF)',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#hls-features',
          },
          videojs: {
            support: 'yes',
            note: 'Through SPF and hls.js',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/migrate-from-video-js-8.mdx',
          },
          bitmovin: {
            support: 'yes',
            source: 'https://developer.bitmovin.com/playback/docs/supported-streaming-formats',
          },
          theoplayer: {
            support: 'yes',
            source: 'https://optiview.dolby.com/docs/theoplayer/v4/changelog/',
          },
        },
      },
      {
        label: 'HLS, MPEG-TS segments',
        feature: 'HLS with MPEG-TS segments',
        cells: {
          shaka: {
            support: 'yes',
            note: 'Transmuxed to MP4',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#transmuxer-support',
          },
          videojs: {
            support: 'yes',
            note: 'Through hls.js, not SPF',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/migrate-from-video-js-8.mdx',
          },
          bitmovin: {
            support: 'yes',
            source: 'https://developer.bitmovin.com/playback/docs/supported-streaming-formats',
          },
          theoplayer: {
            support: 'yes',
            source: 'https://optiview.dolby.com/docs/theoplayer/changelog/',
          },
        },
      },
      {
        label: 'DASH, on demand and live',
        feature: 'DASH on demand and live',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#dash-features',
          },
          videojs: {
            support: 'yes',
            note: 'Through dash.js',
            source:
              'https://github.com/videojs/video.js/blob/main/packages/adapters/shaka-video/src/stream-type.ts',
          },
          bitmovin: {
            support: 'yes',
            source: 'https://developer.bitmovin.com/playback/docs/player-web-x-support-matrix',
          },
          theoplayer: {
            support: 'yes',
            source: 'https://optiview.dolby.com/docs/theoplayer/faq/supported-platforms/',
          },
        },
      },
      {
        label: 'Multi-period DASH',
        feature: 'Multi-period DASH',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#dash-features',
          },
          videojs: {
            support: 'yes',
            note: 'Through dash.js',
            source:
              'https://github.com/videojs/video.js/blob/main/packages/adapters/dash-video/src/media-tracks.ts',
          },
          bitmovin: {
            support: 'yes',
            source: 'https://developer.bitmovin.com/playback/docs/release-notes-web',
          },
          theoplayer: {
            support: 'yes',
            source: 'https://optiview.dolby.com/docs/theoplayer/v10/changelog/',
          },
        },
      },
      {
        label: 'Low-latency HLS',
        feature: 'Low-latency HLS',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#hls-features',
          },
          videojs: {
            support: 'yes',
            note: 'Through hls.js, not SPF',
            source:
              'https://github.com/videojs/video.js/blob/main/packages/adapters/hlsjs-video/src/live.ts',
          },
          bitmovin: {
            support: 'yes',
            note: 'Without rendition reports outside Safari',
            source: 'https://developer.bitmovin.com/playback/docs/low-latency-support',
          },
          theoplayer: {
            support: 'yes',
            source: 'https://optiview.dolby.com/docs/theoplayer/changelog/',
          },
        },
      },
      {
        label: 'Low-latency DASH',
        feature: 'Low-latency DASH',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/demo/common/assets.js',
          },
          videojs: {
            support: 'partial',
            note: 'dash.js settings passed through, not documented',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/media-sources.mdx',
          },
          bitmovin: {
            support: 'yes',
            source: 'https://developer.bitmovin.com/playback/docs/low-latency-support',
          },
          theoplayer: {
            support: 'yes',
            source: 'https://optiview.dolby.com/docs/theoplayer/v7/changelog/',
          },
        },
      },
    ],
  },
  {
    title: 'DRM',
    rows: [
      {
        label: 'Widevine',
        feature: 'Widevine',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#drm-support-matrix',
          },
          videojs: {
            support: 'yes',
            note: 'Through hls.js',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/media-sources.mdx',
          },
          bitmovin: {
            support: 'yes',
            source:
              'https://developer.bitmovin.com/playback/docs/streaming-drm-protected-content-with-bitmovin-player-web-sdk',
          },
          theoplayer: {
            support: 'yes',
            source: 'https://optiview.dolby.com/docs/theoplayer/faq/supported-platforms/',
          },
        },
      },
      {
        label: 'PlayReady',
        feature: 'PlayReady',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#drm-support-matrix',
          },
          videojs: {
            support: 'yes',
            note: 'Through hls.js',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/media-sources.mdx',
          },
          bitmovin: {
            support: 'yes',
            source: 'https://developer.bitmovin.com/playback/docs/drm-content-protection',
          },
          theoplayer: {
            support: 'yes',
            source: 'https://optiview.dolby.com/docs/theoplayer/faq/supported-platforms/',
          },
        },
      },
      {
        label: 'FairPlay',
        feature: 'FairPlay',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#drm-support-matrix',
          },
          videojs: {
            support: 'yes',
            note: 'Native HLS and hls.js',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/media-sources.mdx',
          },
          bitmovin: {
            support: 'yes',
            source:
              'https://developer.bitmovin.com/playback/docs/streaming-drm-protected-content-with-bitmovin-player-web-sdk',
          },
          theoplayer: {
            support: 'yes',
            source: 'https://optiview.dolby.com/docs/theoplayer/faq/supported-platforms/',
          },
        },
      },
    ],
  },
  {
    title: 'Subtitles and captions',
    rows: [
      {
        label: 'TTML and IMSC1',
        feature: 'TTML',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#media-container-and-subtitle-support',
          },
          videojs: { support: 'unstated' },
          bitmovin: {
            support: 'yes',
            source: 'https://developer.bitmovin.com/playback/docs/subtitles-captions',
          },
          theoplayer: {
            support: 'yes',
            note: 'TTML; IMSC1 not named',
            source:
              'https://optiview.dolby.com/docs/theoplayer/how-to-guides/web/text-tracks/introduction/',
          },
        },
      },
      {
        label: 'CEA-608 captions',
        feature: 'CEA-608 captions',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#media-container-and-subtitle-support',
          },
          videojs: {
            support: 'yes',
            note: 'Through hls.js',
            source:
              'https://github.com/videojs/video.js/blob/main/packages/adapters/hlsjs-video/src/text-tracks.ts',
          },
          bitmovin: {
            support: 'yes',
            source: 'https://developer.bitmovin.com/playback/docs/subtitles-captions',
          },
          theoplayer: {
            support: 'yes',
            source:
              'https://optiview.dolby.com/docs/theoplayer/how-to-guides/web/text-tracks/introduction/',
          },
        },
      },
      {
        label: 'CEA-708 captions',
        feature: 'CEA-708 captions',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#media-container-and-subtitle-support',
          },
          videojs: { support: 'unstated' },
          bitmovin: {
            support: 'partial',
            note: 'Experimental, behind an option',
            source: 'https://cdn.bitmovin.com/player/web/8/docs/interfaces/Core.TweaksConfig.html',
          },
          theoplayer: {
            support: 'partial',
            note: '608 track type only',
            source: 'https://optiview.dolby.com/docs/theoplayer/changelog/',
          },
        },
      },
    ],
  },
  {
    title: 'Navigation',
    rows: [
      {
        label: 'Thumbnails',
        feature: 'Thumbnails',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#thumbnails-support',
          },
          videojs: {
            support: 'yes',
            note: 'From a WebVTT storyboard',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/thumbnails.mdx',
          },
          bitmovin: {
            support: 'yes',
            note: 'On demand only, from WebVTT or HLS image playlists',
            source: 'https://developer.bitmovin.com/playback/docs/thumbnail-preview-support',
          },
          theoplayer: {
            support: 'yes',
            source:
              'https://optiview.dolby.com/docs/theoplayer/how-to-guides/web/text-tracks/preview-thumbnails/',
          },
        },
      },
      {
        label: 'Chapters',
        feature: 'Chapters',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#hls-features',
          },
          videojs: {
            support: 'yes',
            note: 'On the time slider, no menu',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/reference/components/time-slider.mdx',
          },
          bitmovin: {
            support: 'partial',
            note: 'Titled markers on the timeline, no chapter tracks',
            source:
              'https://github.com/bitmovin/bitmovin-player-ui/blob/develop/src/ts/UIConfig.ts',
          },
          theoplayer: {
            support: 'yes',
            source:
              'https://optiview.dolby.com/docs/theoplayer/knowledge-base/playback/what-are-chapter-markers/',
          },
        },
      },
      {
        label: 'Trick play from I-frame tracks',
        feature: 'Trick play',
        cells: {
          shaka: {
            support: 'yes',
            source: 'https://github.com/shaka-project/shaka-player/blob/v5.3.0/lib/player.js#L5918',
          },
          videojs: { support: 'unstated' },
          bitmovin: { support: 'unstated' },
          theoplayer: { support: 'unstated' },
        },
      },
    ],
  },
  {
    title: 'Network',
    rows: [
      {
        label: 'CMCD',
        feature: 'CMCD',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/lib/util/cmcd_manager.js',
          },
          videojs: {
            support: 'partial',
            note: 'Engine settings passed through, not documented',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/media-sources.mdx',
          },
          bitmovin: {
            support: 'yes',
            note: 'Version 1, through its own package',
            source: 'https://developer.bitmovin.com/playback/docs/cmcd-support-at-bitmovin',
          },
          theoplayer: {
            support: 'yes',
            source:
              'https://optiview.dolby.com/docs/theoplayer/how-to-guides/web/cmcd/getting-started/',
          },
        },
      },
      {
        label: 'CMSD',
        feature: 'CMSD',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/lib/util/cmsd_manager.js',
          },
          videojs: {
            support: 'partial',
            note: 'dash.js settings passed through, not documented',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/media-sources.mdx',
          },
          bitmovin: { support: 'unstated' },
          theoplayer: { support: 'unstated' },
        },
      },
      {
        label: 'Content steering',
        feature: 'Content steering',
        cells: {
          shaka: {
            support: 'yes',
            note: 'Version 1',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#content-steering-support',
          },
          videojs: {
            support: 'yes',
            note: 'Through hls.js, not SPF',
            source:
              'https://github.com/videojs/video.js/blob/main/packages/adapters/hlsjs-video/src/media-tracks.ts',
          },
          bitmovin: {
            support: 'yes',
            source:
              'https://cdn.bitmovin.com/player/web/8/docs/enums/Core.ContentLocationChangedReason.html',
          },
          theoplayer: {
            support: 'partial',
            note: 'DASH only',
            source:
              'https://optiview.dolby.com/docs/theoplayer/how-to-guides/web/content-steering/mpeg-dash-content-steering/',
          },
        },
      },
    ],
  },
  {
    title: 'Ads',
    rows: [
      {
        label: 'HLS interstitials',
        feature: 'HLS interstitials',
        cells: {
          shaka: {
            support: 'yes',
            note: 'Without X-SNAP',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#monetization-with-ads',
          },
          videojs: { support: 'unstated' },
          bitmovin: {
            support: 'yes',
            source: 'https://developer.bitmovin.com/playback/docs/advertising-support',
          },
          theoplayer: { support: 'unstated' },
        },
      },
      {
        label: 'SCTE-35 breaks',
        feature: 'SCTE-35 breaks',
        cells: {
          shaka: {
            support: 'partial',
            note: 'Raw messages; your app reads them',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/docs/tutorials/scte35.md',
          },
          videojs: {
            support: 'partial',
            note: 'Date range cues through hls.js, no ad breaks',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/reference/api/hls-metadata-track.mdx',
          },
          bitmovin: {
            support: 'partial',
            note: 'HLS tags as metadata only',
            source: 'https://cdn.bitmovin.com/player/web/8/docs/enums/Core.MetadataType.html',
          },
          theoplayer: {
            support: 'partial',
            note: 'HLS date range cues as metadata only',
            source:
              'https://optiview.dolby.com/docs/theoplayer/v11/api-reference/web/interfaces/DateRangeCue.html',
          },
        },
      },
      {
        label: 'VAST',
        feature: 'VAST 2 to 4.3',
        cells: {
          shaka: {
            support: 'yes',
            note: 'Basic, without the IMA SDK',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#monetization-with-ads',
          },
          videojs: {
            support: 'no',
            note: 'The docs state no ad support',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/migrate-from-video-js-8.mdx',
          },
          bitmovin: {
            support: 'yes',
            source: 'https://developer.bitmovin.com/playback/docs/advertising-support',
          },
          theoplayer: {
            support: 'yes',
            source:
              'https://optiview.dolby.com/docs/theoplayer/knowledge-base/advertisement/support-matrix/',
          },
        },
      },
      {
        label: 'VMAP',
        feature: 'VMAP 1.0.1',
        cells: {
          shaka: {
            support: 'yes',
            note: 'Basic, without the IMA SDK',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#monetization-with-ads',
          },
          videojs: {
            support: 'no',
            note: 'The docs state no ad support',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/migrate-from-video-js-8.mdx',
          },
          bitmovin: {
            support: 'yes',
            source: 'https://developer.bitmovin.com/playback/docs/advertising-support',
          },
          theoplayer: {
            support: 'yes',
            source:
              'https://optiview.dolby.com/docs/theoplayer/knowledge-base/advertisement/support-matrix/',
          },
        },
      },
    ],
  },
  {
    title: 'Around the player',
    rows: [
      {
        label: 'Playlist with next and previous',
        feature: 'Next, previous, repeat and shuffle',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/docs/tutorials/queue-manager.md',
          },
          videojs: {
            support: 'no',
            note: 'The docs state no playlist support',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/migrate-from-video-js-8.mdx',
          },
          bitmovin: { support: 'unstated' },
          theoplayer: {
            support: 'partial',
            note: 'An up next page, no queue',
            source:
              'https://optiview.dolby.com/docs/theoplayer/how-to-guides/web/miscellaneous/up-next/',
          },
        },
      },
      {
        label: 'Samsung Tizen and LG webOS',
        feature: 'Samsung Tizen and LG webOS, from 2021 models',
        cells: {
          shaka: {
            support: 'yes',
            note: 'webOS untested by the project',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#platform-and-browser-support-matrix',
          },
          videojs: {
            support: 'no',
            note: 'The docs state TVs are not a target',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/browser-support.mdx',
          },
          bitmovin: {
            support: 'yes',
            source:
              'https://developer.bitmovin.com/playback/docs/supported-platforms-devices-player',
          },
          theoplayer: {
            support: 'yes',
            source: 'https://optiview.dolby.com/docs/theoplayer/faq/supported-platforms/',
          },
        },
      },
      {
        label: 'Chromecast sender',
        feature: 'Chromecast sender',
        cells: {
          shaka: {
            support: 'yes',
            source:
              'https://github.com/shaka-project/shaka-player/blob/v5.3.0/README.md#platform-and-browser-support-matrix',
          },
          videojs: {
            support: 'yes',
            note: 'An extension, Chromium only',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/casting.mdx',
          },
          bitmovin: {
            support: 'yes',
            source: 'https://developer.bitmovin.com/playback/docs/caf-support',
          },
          theoplayer: {
            support: 'yes',
            source:
              'https://optiview.dolby.com/docs/theoplayer/how-to-guides/web/cast/chromecast/enable-chromecast-on-the-sender/',
          },
        },
      },
      {
        label: 'AirPlay',
        feature: 'AirPlay',
        cells: {
          shaka: {
            support: 'yes',
            note: 'With MSE, HLS only',
            source: 'https://github.com/shaka-project/shaka-player/blob/v5.3.0/ui/remote_button.js',
          },
          videojs: {
            support: 'yes',
            note: 'Safari only',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/casting.mdx',
          },
          bitmovin: {
            support: 'yes',
            source: 'https://cdn.bitmovin.com/player/web/8/docs/interfaces/Core.PlayerAPI.html',
          },
          theoplayer: {
            support: 'yes',
            source:
              'https://optiview.dolby.com/docs/theoplayer/how-to-guides/web/cast/airplay/introduction/',
          },
        },
      },
      {
        label: 'Quality of experience metrics',
        feature: 'Quality of experience metrics',
        cells: {
          shaka: {
            support: 'yes',
            source: 'https://github.com/shaka-project/shaka-player/blob/v5.3.0/lib/player.js#L7414',
          },
          videojs: {
            support: 'partial',
            note: 'Through the Mux Data extension',
            source:
              'https://github.com/videojs/video.js/blob/main/site/src/content/docs/guides/mux-data.mdx',
          },
          bitmovin: {
            support: 'yes',
            note: 'Bitmovin Analytics',
            source: 'https://developer.bitmovin.com/playback/docs/setup-analytics-web',
          },
          theoplayer: {
            support: 'yes',
            source:
              'https://optiview.dolby.com/docs/theoplayer/v11/api-reference/web/interfaces/Metrics.html',
          },
        },
      },
    ],
  },
];
