/** The facts about the project every page shares. */

/** The product's name. */
export const siteName = 'Mattebox';

/** One sentence on what Mattebox is. */
export const siteDescription =
  'Mattebox is an open source HLS and DASH player for the web: an engine, a player element and its accessories. MIT licensed, and a fraction of the size of the others.';

/** The owner's GitHub account, where every repository lives. */
const github = 'https://github.com/jboix';

/** The repositories. */
export const repositories = {
  engine: `${github}/mattebox`,
  player: `${github}/mattebox-player`,
  receiver: `${github}/mattebox-receiver`,
  editor: `${github}/mattebox-player-editor`,
  site: `${github}/mattebox-site`,
} as const;

/** The pages the project hosts on GitHub Pages: what a reader can try in a browser. */
export const hosted = {
  playground: 'https://jboix.github.io/mattebox/',
  demo: 'https://jboix.github.io/mattebox-player/',
  playlist: 'https://jboix.github.io/mattebox-player/playlist.html',
  reels: 'https://jboix.github.io/mattebox-player/reels.html',
  editor: 'https://jboix.github.io/mattebox-player-editor/',
  receiver: 'https://jboix.github.io/mattebox-receiver/',
} as const;
