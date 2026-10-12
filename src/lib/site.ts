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

/** The pages the project hosts, each on its own subdomain: what a reader can try in a browser. */
export const hosted = {
  playground: 'https://engine.mattebox.ch/',
  demo: 'https://demo.mattebox.ch/',
  playlist: 'https://demo.mattebox.ch/playlist.html',
  reels: 'https://demo.mattebox.ch/reels.html',
  editor: 'https://editor.mattebox.ch/',
  receiver: 'https://cast.mattebox.ch/',
} as const;
