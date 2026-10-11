/**
 * Reads the bars of a size chart the product repositories draw. Each repository measures its own
 * bundles and the others' with one script, and the chart is that script's output, so the site
 * shows the same figures and never a copy typed by hand.
 */

/** One bar of a chart. */
interface SizeRow {
  /** What was measured, such as `hls.js`. */
  readonly label: string;
  /** The version and what the bundle holds. */
  readonly detail: string;
  /** The size, minified and gzipped, in kilobytes. */
  readonly kilobytes: number;
}

/** A chart: what it measures, how, and its bars. */
export interface SizeChart {
  readonly title: string;
  readonly method: string;
  readonly rows: readonly SizeRow[];
}

/**
 * The text nodes of an SVG, in order.
 *
 * @param svg - The SVG's source.
 * @returns The texts.
 */
function textsOf(svg: string): string[] {
  return [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((match) => match[1] ?? '');
}

/**
 * Parses a size chart. Its texts are the title, the method, then three per bar: the label, the
 * detail and the size. The axis ticks, plain numbers, follow and are left out.
 *
 * @param svg - The chart's source.
 * @returns The chart.
 */
export function parseSizeChart(svg: string): SizeChart {
  const [title = '', method = '', ...rest] = textsOf(svg);
  const rows: SizeRow[] = [];
  for (let index = 0; index + 2 < rest.length; index += 3) {
    const size = /^([\d.]+) KB$/.exec(rest[index + 2] ?? '');
    if (size === null) break;
    rows.push({
      label: rest[index] ?? '',
      detail: rest[index + 1] ?? '',
      kilobytes: Number(size[1]),
    });
  }
  return { title, method, rows };
}
