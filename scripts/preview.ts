/**
 * `bun run site:preview`: serves the built site, `dist/`, the way GitHub Pages serves it, on
 * http://localhost:4321. The search works here, since the build writes its index into `dist/`.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { dist, respond } from './serve.ts';

if (!existsSync(join(dist, 'index.html'))) {
  process.stderr.write('No built site: run bun run site:build first.\n');
  process.exit(1);
}
const server = Bun.serve({ port: Number(process.env.PORT ?? 4321), fetch: respond });
process.stdout.write(`The built site is at http://localhost:${server.port}/\n`);
