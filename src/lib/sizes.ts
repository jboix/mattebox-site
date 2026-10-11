/** The size charts the collecting script read from the product repositories. */
import { readFileSync } from 'node:fs';
import type { SizeChart } from './size-chart.ts';

/** The charts by name. */
export interface Sizes {
  /** The engine against the other engines. */
  readonly engine: SizeChart;
  /** The engine's presets, from the kernel alone to every stage. */
  readonly presets: SizeChart;
  /** The player with its engine against the other players with theirs. */
  readonly player: SizeChart;
}

/**
 * Reads the charts. The build and the dev server both start in the site's folder.
 *
 * @returns The charts.
 */
export function readSizes(): Sizes {
  return JSON.parse(readFileSync(`${process.cwd()}/.docs/sizes.json`, 'utf8'));
}

/**
 * The size of a chart's first bar, which is Mattebox's.
 *
 * @param chart - The chart.
 * @returns The size in kilobytes.
 */
export function ours(chart: SizeChart): number {
  const first = chart.rows[0];
  if (first === undefined) throw new Error(`${chart.title} has no bar.`);
  return first.kilobytes;
}
