/**
 * The player by configuration, as the player's stack chart measures it: the player alone, then
 * with engine stages and packages. The size article shows each configuration's code beside the
 * size the chart gives it, and this module keeps the two the same configuration.
 */
import type { SizeChart } from './size-chart.ts';

/** One row of the stack chart, as the article describes it. */
export interface Step {
  /** The row's label in the chart. */
  readonly row: string;
  /** What the article calls the step, when the chart's label says more than the step adds. */
  readonly label?: string;
  /** The engine stages it adds, by their path under `mattebox/`, such as `stages/abr`. */
  readonly stages?: readonly string[];
  /** The player packages it adds, by the chart's word for each, such as `live-captions`. */
  readonly packages?: readonly string[];
}

/** A step with its measured size and what it adds to the step above it. */
export interface MeasuredStep {
  readonly step: Step;
  /** The player with every step so far, minified and gzipped, in kilobytes. */
  readonly kilobytes: number;
  /** What the step adds to the one before it, or null for the first step. */
  readonly added: number | null;
}

/**
 * The detail the chart prints under a step's label: what the step adds, after a `+` when the
 * chart's row adds to the row above it, or `no stages` for the player alone.
 *
 * @param step - The step.
 * @returns The detail, without the version the chart puts before it.
 */
export function detailOf(step: Step): string {
  const parts = [
    ...(step.stages ?? []).map((path) => path.split('/').pop() ?? path),
    ...(step.packages ?? []),
  ].join(', ');
  if (parts === '') return 'no stages';
  return step.row.startsWith('+') ? `+ ${parts}` : parts;
}

/**
 * Measures a chain of steps from the chart, and fails when a step's row is missing or measured
 * another configuration than the step describes.
 *
 * @param chart - The player's stack chart.
 * @param steps - The steps, the first one the player alone.
 * @returns Each step with its size and what it adds to the step before it.
 */
export function measure(chart: SizeChart, steps: readonly Step[]): MeasuredStep[] {
  let last: number | null = null;
  return steps.map((step) => {
    const row = chart.rows.find((each) => each.label === step.row);
    if (row === undefined) throw new Error(`The stack chart has no row "${step.row}".`);
    const detail = detailOf(step);
    // The chart prints the version first: `main · hls-cmaf, abr`.
    if (!row.detail.endsWith(` · ${detail}`)) {
      throw new Error(`The row "${step.row}" measured "${row.detail}", not "${detail}".`);
    }
    const added = last === null ? null : row.kilobytes - last;
    last = row.kilobytes;
    return { step, kilobytes: row.kilobytes, added };
  });
}

/** `stages/text-webvtt` as `textWebvtt`, the identifier the stage is imported as. */
function localName(path: string): string {
  const name = path.split('/').pop() ?? path;
  return name.replace(/-([a-z0-9])/g, (_, letter: string) => letter.toUpperCase());
}

/**
 * The code of the configuration the steps add up to: the player, the packages, the stages, and
 * the `define()` call that gives the player those stages.
 *
 * @param steps - The steps, the first one the player alone.
 * @param specifiers - The import specifier of each package, by the chart's word for it.
 * @returns The script.
 */
export function pageCode(
  steps: readonly Step[],
  specifiers: Readonly<Record<string, string>>,
): string {
  const stages = steps.flatMap((step) => step.stages ?? []);
  const unique = stages.filter((path, index) => stages.indexOf(path) === index);
  const packages = steps.flatMap((step) => step.packages ?? []);
  const lines = ["import { MatteboxPlayerElement } from '@mattebox/player';"];
  for (const name of packages) {
    const specifier = specifiers[name];
    if (specifier === undefined) throw new Error(`No package named "${name}".`);
    lines.push(`import '${specifier}';`);
  }
  for (const path of unique) lines.push(`import ${localName(path)} from 'mattebox/${path}';`);
  lines.push('', 'MatteboxPlayerElement.define({', '  stages: [');
  for (const path of unique) lines.push(`    ${localName(path)}(),`);
  lines.push('  ],', '});');
  return lines.join('\n');
}
