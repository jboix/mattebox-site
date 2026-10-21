/**
 * Answers a request for the built site, `dist/`, the way GitHub Pages does. A folder answers with
 * its `index.html`; a folder asked for without its final slash redirects to it; any other missing
 * path gets `404.html` with a 404. The preview and the accessibility check serve the site with it.
 */
import { existsSync, statSync } from 'node:fs';
import { join, normalize } from 'node:path';

/** The built site. */
export const dist = normalize(new URL('../dist/', import.meta.url).pathname);

/** What a path of the site answers with. */
type Answer =
  | { readonly kind: 'file'; readonly path: string }
  | { readonly kind: 'redirect'; readonly to: string }
  | { readonly kind: 'missing' };

/**
 * What GitHub Pages would answer for a path.
 *
 * @param pathname - The address's path, such as `/docs/alerts`.
 * @returns The file to serve, the address to redirect to, or that nothing lives there.
 */
function answerFor(pathname: string): Answer {
  const target = normalize(join(dist, decodeURIComponent(pathname)));
  if (!target.startsWith(dist) || !existsSync(target)) return { kind: 'missing' };
  if (statSync(target).isFile()) return { kind: 'file', path: target };
  if (!pathname.endsWith('/')) return { kind: 'redirect', to: `${pathname}/` };
  const index = join(target, 'index.html');
  return existsSync(index) ? { kind: 'file', path: index } : { kind: 'missing' };
}

/**
 * The response for a request.
 *
 * @param request - The request.
 * @returns The file, the redirect, or the site's 404 page.
 */
export function respond(request: Request): Response {
  const url = new URL(request.url);
  const answer = answerFor(url.pathname);
  if (answer.kind === 'file') return new Response(Bun.file(answer.path));
  if (answer.kind === 'redirect') return Response.redirect(`${answer.to}${url.search}`, 301);
  const notFound = Bun.file(join(dist, '404.html'));
  return new Response(notFound, { status: 404, headers: { 'Content-Type': 'text/html' } });
}
