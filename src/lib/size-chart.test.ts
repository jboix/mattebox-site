import { expect, test } from 'bun:test';
import { parseSizeChart } from './size-chart.ts';

const text = (value: string) => `<text x="1" y="2" fill="#000">${value}</text>`;

test('reads the title, the method and one row per bar, without the axis', () => {
  const svg = [
    'Engine size',
    'min+gzip',
    'mattebox',
    'main',
    '82.5 KB',
    'hls.js',
    'v1.7.2',
    '184.1 KB',
    '0',
    '50',
    '100',
  ]
    .map(text)
    .join('');
  expect(parseSizeChart(svg)).toEqual({
    title: 'Engine size',
    method: 'min+gzip',
    rows: [
      { label: 'mattebox', detail: 'main', kilobytes: 82.5 },
      { label: 'hls.js', detail: 'v1.7.2', kilobytes: 184.1 },
    ],
  });
});
