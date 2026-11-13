import { expect, test } from 'bun:test';
import { featureGroups } from './features.ts';
import { extras, matrix, rivals } from './matrix.ts';

const rows = matrix.flatMap((group) => group.rows);
const cells = rows.flatMap((row) => rivals.map((rival) => row.cells[rival.id]));

test('a row that names a feature names one Mattebox lists', () => {
  const names = new Set(featureGroups.flatMap((group) => group.features.map((each) => each.name)));
  for (const row of rows) if (row.feature !== undefined) expect(names.has(row.feature)).toBe(true);
});

test('every stated cell links to its source', () => {
  for (const cell of cells) {
    if (cell.support === 'unstated') expect(cell.source).toBeUndefined();
    else expect(cell.source).toStartWith('https://');
  }
});

test('no row is listed twice', () => {
  const labels = rows.map((row) => row.label);
  expect(new Set(labels).size).toBe(labels.length);
});

test('every feature another player has and Mattebox lacks links to its source', () => {
  for (const rival of rivals) {
    for (const extra of extras[rival.id]) expect(extra.source).toStartWith('https://');
  }
});
