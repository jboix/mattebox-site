# AGENTS.md: standing instructions for the Mattebox site

This file applies to every change in this repository.

## What this project is

The website of Mattebox: the landing page, the feature table, the comparison,
and the versioned docs of every deliverable. Astro builds it as static files,
and Bun runs every script. Read the [README](README.md) first.

## Non-negotiable rules

1. **The docs are not written here.** Each chapter comes from its product
   repository at a release tag. A wrong sentence in a guide is fixed in that
   repository. This repository only decides which chapter belongs to which
   book, in `src/lib/books.ts`.

2. **Every claim has a source.** A feature in `src/data/features.ts` names
   the chapter that documents it, and a test fails when that chapter does not
   exist. A size comes from the chart its repository draws, never from a
   number typed here. A fact about another player links to where that project
   states it.

3. **No number about another player is typed by hand.** The sizes are read by
   `bun run collect`. The commercial players' prices are theirs to state, so
   the site says only that there is one.

4. **Static output only.** No server rendering, no client framework. A page's
   script is plain TypeScript, and the one custom element on the site is the
   player itself.

5. **Every internal link goes through `link()`** in `src/lib/url.ts`, so the
   site works at a domain's root and under a path.

6. **Colours, fonts and radii come from `src/styles/tokens.css`.** They are
   the colours of the mark: paper, charcoal, vermilion. Vermilion is for the
   brand and for the one call to action of a page.

7. **Do not weaken a gate to get it green.** Fix the code, the link, or the
   page.

## Before writing code

- Check whether the logic belongs in `src/lib`, where it is a pure function
  with a test, or in a script, which only reads and writes files.
- Library versions here are newer than most training data. Read the installed
  type definitions before using an Astro or Bun API.

## While writing code

- Relative imports with the `.ts` extension. No path aliases.
- `import type` for type-only imports.
- TSDoc on every declaration, exported or not, describing the contract.
- Comments explain **why**.
- Prefer the platform and Bun's own APIs over a package. A new dependency
  needs one sentence of reason in the commit body.

## Writing

Documentation, comments, commit messages and every string a visitor reads use
direct language. The marketing pages are not an exception.

- Write plain declarative sentences. State the fact, then at most one
  sentence of why.
- Write subject, verb, object. Address the reader as "you" and say what they
  can do.
- No em-dashes. Use commas, colons, parentheses, periods.
- No aphorisms or clever turns. A claim is a fact with a number or a link.
- No superlative without a measurement beside it. "109 KB, 55% of the next
  smallest", never "the smallest player".
- One fact per bullet. Paragraphs of one to three short sentences.

## Commits

- Conventional Commits, enforced by commitlint. A body is required.
- `chore` for tooling, `docs` for this repository's own docs, `feat` and
  `fix` for the pages and the scripts.
- Small commits, each passing `bun run verify`.
- Husky runs Biome on staged files before a commit, commitlint on the
  message, and `bun run verify` before a push. Do not skip hooks.

## Before declaring a change complete

Run the gates and report their actual output:

```sh
bun run lint
bun run docs:check
bun run knip
bun run test
bun run build
bun run typecheck
```

`bun run verify` chains them. `bun run build` includes the link check and the
check of every page's head tags.

## When something seems wrong

- A broken link in a guide is usually a chapter that moved in its product
  repository. Update `src/lib/books.ts`, do not patch the built page.
- If a gate looks wrong, say so and stop. Do not change it silently.
