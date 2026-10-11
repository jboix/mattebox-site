/** `robots.txt`: every page may be crawled, and the sitemap says which ones exist. */
import type { APIRoute } from 'astro';
import { absoluteLink } from '../lib/url.ts';

export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteLink('sitemap-index.xml', site)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
