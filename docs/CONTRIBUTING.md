# Contributing to the Mattebox site

Thank you for helping. This page says how to run the site, what the gates
check, and where things live.

## Set up

You need [Bun](https://bun.sh), at the version in `.tool-versions`, and git.

```sh
bun install
bun run verify    # everything CI checks
bun run dev       # the site, at the URL Astro prints
```

The docs come from the product repositories. With `../mattebox`,
`../mattebox-player` and `../mattebox-receiver` beside this folder, the site
reads them there, your unpushed work on `main` included. Without them it
clones each one into `.sources/`.

## The gates

| Command              | Tool        | What it catches                                              |
| -------------------- | ----------- | ------------------------------------------------------------ |
| `bun run lint`       | Biome       | Formatting and lint rules                                    |
| `bun run docs:check` | remark      | Markdown formatting, broken links and anchors                |
| `bun run knip`       | knip        | Dead code, unused exports and dependencies                   |
| `bun run test`       | Bun         | The version, link and Markdown logic, and the data           |
| `bun run build`      | Astro       | The pages build, every link resolves, every head is complete |
| `bun run check:a11y` | axe-core    | Every built page, in both themes, against WCAG 2.2 A and AA  |
| `bun run typecheck`  | astro check | Type errors in pages, components and scripts                 |

## Where things live

| Path               | What it holds                                             |
| ------------------ | --------------------------------------------------------- |
| `src/lib/books.ts` | The books and their chapters                              |
| `src/lib`          | Pure logic, each file with its test                       |
| `src/data`         | The feature table, the comparison, the demos, the figures |
| `src/pages`        | One file per page, and one for every docs page            |
| `src/components`   | The parts of the pages                                    |
| `src/styles`       | The tokens, the base styles, the styles of a doc          |
| `scripts`          | Collecting the docs, the search index, the checks         |
| `public/guide`     | The screenshots the guides show                           |

## Common changes

- **A new chapter in a guide.** Add it to its book in `src/lib/books.ts`.
- **A new feature.** Add a row to `src/data/features.ts`, with the chapter
  that documents it. The test fails if the chapter does not exist.
- **A new screenshot.** Add it to `src/data/figures.ts`, take it in
  `scripts/screenshots.ts`, and run `bun run screenshots`.
- **A wrong sentence in a guide.** Fix it in the product repository. The
  site picks it up on its next build.

## Commits

Commits follow [Conventional Commits](https://www.conventionalcommits.org),
and a body is required. `bun install` sets up the git hooks through husky:
`commit-msg` runs commitlint, `pre-commit` runs Biome and the docs check, and
`pre-push` runs `bun run verify`.

## Style

If `bun run verify` passes, the style is right. The writing rules are in
[AGENTS.md](../AGENTS.md), and they apply to the marketing pages too.
