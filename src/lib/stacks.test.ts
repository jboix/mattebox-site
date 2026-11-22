import { expect, test } from 'bun:test';
import type { SizeChart } from './size-chart.ts';
import { detailOf, measure, pageCode, type Step } from './stacks.ts';

const chart: SizeChart = {
  title: 'Player size by configuration',
  method: 'min+gzip',
  rows: [
    { label: 'Player alone', detail: 'main · no stages', kilobytes: 67.1 },
    { label: '+ HLS on demand', detail: 'main · + hls-cmaf, abr', kilobytes: 75.8 },
    { label: '+ live captions', detail: 'main · + live-captions', kilobytes: 79.7 },
    { label: 'Player + DASH on demand', detail: 'main · dash-cmaf, abr', kilobytes: 79.6 },
  ],
};

const steps: Step[] = [
  { row: 'Player alone' },
  { row: '+ HLS on demand', stages: ['protocols/hls-cmaf', 'stages/abr'] },
  { row: '+ live captions', packages: ['live-captions'] },
];

test('a detail says what the step adds, with a plus when its row adds to the row above', () => {
  expect(steps.map(detailOf)).toEqual(['no stages', '+ hls-cmaf, abr', '+ live-captions']);
  expect(detailOf({ row: 'Player + DASH on demand', stages: ['protocols/dash-cmaf'] })).toBe(
    'dash-cmaf',
  );
});

test('measures each step and what it adds to the step before it', () => {
  const measured = measure(chart, steps);
  expect(measured.map((each) => each.kilobytes)).toEqual([67.1, 75.8, 79.7]);
  expect(measured[0]?.added).toBeNull();
  expect(measured[1]?.added).toBeCloseTo(8.7);
  expect(measured[2]?.added).toBeCloseTo(3.9);
});

test('a row that is a whole configuration still adds to the player before it', () => {
  const measured = measure(chart, [
    { row: 'Player alone' },
    { row: 'Player + DASH on demand', stages: ['protocols/dash-cmaf', 'stages/abr'] },
  ]);
  expect(measured[1]?.added).toBeCloseTo(12.5);
});

test('fails when the chart measured another configuration', () => {
  expect(() =>
    measure(chart, [{ row: '+ HLS on demand', stages: ['protocols/hls-cmaf'] }]),
  ).toThrow('measured');
  expect(() => measure(chart, [{ row: 'Player + nothing' }])).toThrow('no row');
});

test("writes the configuration's code", () => {
  const code = pageCode(steps, { 'live-captions': '@mattebox/player-live-captions' });
  expect(code).toBe(
    [
      "import { MatteboxPlayerElement } from '@mattebox/player';",
      "import '@mattebox/player-live-captions';",
      "import hlsCmaf from 'mattebox/protocols/hls-cmaf';",
      "import abr from 'mattebox/stages/abr';",
      '',
      'MatteboxPlayerElement.define({',
      '  stages: [',
      '    hlsCmaf(),',
      '    abr(),',
      '  ],',
      '});',
    ].join('\n'),
  );
});
