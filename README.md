<h1>
  <img src="docs/logo.svg" width="44" height="44" align="absmiddle" alt="">
  Mattebox site
</h1>

[![Quality](https://github.com/jboix/mattebox-site/actions/workflows/quality.yml/badge.svg)](https://github.com/jboix/mattebox-site/actions/workflows/quality.yml)
[![Site](https://github.com/jboix/mattebox-site/actions/workflows/site.yml/badge.svg)](https://github.com/jboix/mattebox-site/actions/workflows/site.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

The website of [Mattebox](https://github.com/jboix/mattebox), an open source
HLS and DASH player for the web, at [mattebox.ch](https://mattebox.ch/). It
holds the landing page, the feature table, the comparison with other
players, and the versioned docs of every deliverable.

The site is static. Astro builds it, and Bun runs every script.

## Run it

```sh
bun install
bun run dev        # the site, at the URL Astro prints
bun run build      # the built site in dist/, with every check
bun run preview    # dist/ served the way GitHub Pages serves it
```

`bun run dev` and `bun run build` first collect the docs. The docs are not
in this repository. See [the docs](#the-docs).

## The pages

| Page     | Address      | Source                   |
| -------- | ------------ | ------------------------ |
| Home     | `/`          | `src/pages/index.astro`  |
| Features | `/features/` | `src/data/features.ts`   |
| Compare  | `/compare/`  | `src/data/compare.ts`    |
| Try it   | `/try/`      | `src/data/try.ts`        |
| Docs     | `/docs/`     | The product repositories |

## The docs

Each deliverable is a book with its own versions, because each package is
released on its own.

| Book          | Package                        | Repository          |
| ------------- | ------------------------------ | ------------------- |
| Engine        | `mattebox`                     | `mattebox`          |
| Player        | `@mattebox/player`             | `mattebox-player`   |
| Player core   | `@mattebox/player-core`        | `mattebox-player`   |
| Playlist      | `@mattebox/player-playlist`    | `mattebox-player`   |
| Diagnostics   | `@mattebox/player-diagnostics` | `mattebox-player`   |
| TV navigation | `@mattebox/player-spatial-nav` | `mattebox-player`   |
| Cast sender   | `@mattebox/player-cast`        | `mattebox-player`   |
| Cast receiver | `@mattebox/cast-receiver`      | `mattebox-receiver` |

`bun run collect` reads the chapters of each book from its repository:

- It lists the book's release tags and keeps the latest patch of the three
  newest minor versions, plus the main branch as `next`.
- It reads each chapter at each of those refs and writes it under `.docs/`.
- It rewrites every link: to a page of the site, or to the file on GitHub at
  that version's tag.
- It copies the images the chapters show into `public/doc-assets/`.
- It reads the size charts each repository draws, for the size figures.

A repository is read from the folder beside this one when it is there, such
as `../mattebox`. Otherwise the script clones it into `.sources/`. Set
`MATTEBOX_SOURCES` to look in another folder.

The addresses say where a page is:

| Address                          | What it is                     |
| -------------------------------- | ------------------------------ |
| `/docs/player/the-element/`      | The latest release of the book |
| `/docs/player/v0.7/the-element/` | An older release               |
| `/docs/player/next/the-element/` | The main branch                |

To add a chapter or a book, edit `src/lib/books.ts`.

## The screenshots

The guides show screenshots the site adds, listed in `src/data/figures.ts`.
`bun run screenshots` takes them from the hosted demos into `public/guide/`.
The files are committed, so a build needs no browser.

## Deployment

The `Website` workflow builds the site and deploys it to GitHub Pages, which
serves it at [mattebox.ch](https://mattebox.ch/). It runs on a push to
`main`, every night, and by hand. The nightly run is what publishes the docs
of a new release of a package.

`SITE_URL` and `SITE_BASE` set the address the site is built for. The
workflow reads both from GitHub Pages.

## Contributing

See [CONTRIBUTING](docs/CONTRIBUTING.md), the
[code of conduct](docs/CODE_OF_CONDUCT.md) and the
[security policy](docs/SECURITY.md). Report an accessibility barrier as the
[accessibility statement](docs/ACCESSIBILITY.md) describes.

## License

[MIT](LICENSE)
