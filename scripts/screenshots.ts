/**
 * `bun run screenshots`: takes the pictures the guides show, from the hosted demos, into
 * `public/guide/`. The files are committed, so a build needs no browser. Run it again when the
 * controls change their look. Firefox takes them, since it decodes the demo streams' H.264.
 */
import { mkdirSync } from 'node:fs';
import { type Browser, firefox, type Page } from 'playwright';
import { hosted } from '../src/lib/site.ts';

const folder = new URL('../public/guide/', import.meta.url).pathname;
const desktop = { width: 1280, height: 800 };
const phone = { width: 390, height: 700 };

/**
 * Opens a page and waits for its player to have loaded a source.
 *
 * @param browser - The browser.
 * @param url - The page's address.
 * @param viewport - The window's size.
 * @returns The page.
 */
async function open(
  browser: Browser,
  url: string,
  viewport: { width: number; height: number },
): Promise<Page> {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1.5,
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(7000);
  return page;
}

/**
 * Pauses the page's video on a frame with a picture, so every run shows the same one.
 *
 * @param page - The page.
 */
async function settle(page: Page): Promise<void> {
  await page.evaluate(() => {
    const video = document.querySelector('video');
    if (video === null) return;
    video.pause();
    video.currentTime = 42;
  });
  await page.waitForTimeout(2500);
  await page.mouse.move(200, 200);
}

/**
 * Presses the button of a control of the player, which sits in the control's shadow root.
 *
 * @param page - The page.
 * @param tag - The control's tag.
 */
async function press(page: Page, tag: string): Promise<void> {
  await page.evaluate((name) => {
    document.querySelector(name)?.shadowRoot?.querySelector('button')?.click();
  }, tag);
  await page.waitForTimeout(600);
}

mkdirSync(folder, { recursive: true });
const browser = await firefox.launch({
  // Firefox's own button over a video would be in every picture.
  firefoxUserPrefs: { 'media.videocontrols.picture-in-picture.video-toggle.enabled': false },
});

const demo = await open(browser, hosted.demo, desktop);
await settle(demo);
await demo
  .locator('mattebox-player')
  .screenshot({ type: 'jpeg', path: `${folder}player.jpg`, quality: 84 });
await press(demo, 'mbx-quality-menu');
await demo
  .locator('mattebox-player')
  .screenshot({ type: 'jpeg', path: `${folder}player-menu.jpg`, quality: 84 });

const compact = await open(browser, hosted.demo, phone);
await settle(compact);
await compact
  .locator('mattebox-player')
  .screenshot({ type: 'jpeg', path: `${folder}player-compact.jpg`, quality: 84 });

const playlist = await open(browser, hosted.playlist, desktop);
await settle(playlist);
await playlist.evaluate(() => document.querySelector('mbx-playlist')?.setAttribute('open', ''));
await playlist.waitForTimeout(600);
await playlist
  .locator('mattebox-player')
  .screenshot({ type: 'jpeg', path: `${folder}playlist.jpg`, quality: 84 });

const playground = await open(browser, hosted.playground, desktop);
await playground.screenshot({ type: 'jpeg', path: `${folder}playground.jpg`, quality: 84 });

const receiver = await open(browser, hosted.receiver, desktop);
await receiver.screenshot({ type: 'jpeg', path: `${folder}receiver.jpg`, quality: 84 });

await browser.close();
process.stdout.write(`Wrote the screenshots to ${folder}\n`);
