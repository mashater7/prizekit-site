import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseEntries, pickWinners } from '../src/lib/randomizer.js';

test('parseEntries: строки в массив, пустые и пробелы убираются', () => {
  assert.deepEqual(parseEntries('Аня\n Боря \n\nВера\n'), ['Аня', 'Боря', 'Вера']);
});

test('parseEntries: дубликаты удаляются', () => {
  assert.deepEqual(parseEntries('Аня\nАня\nБоря'), ['Аня', 'Боря']);
});

test('pickWinners: выбирает нужное число уникальных победителей', () => {
  const entries = ['a', 'b', 'c', 'd', 'e'];
  const winners = pickWinners(entries, 3, () => 0.5);
  assert.equal(winners.length, 3);
  assert.equal(new Set(winners).size, 3);
});

test('pickWinners: если победителей больше чем участников — вернуть всех', () => {
  const winners = pickWinners(['a', 'b'], 5, Math.random);
  assert.equal(winners.length, 2);
});

test('pickWinners: 0 участников → пустой массив', () => {
  assert.deepEqual(pickWinners([], 3, Math.random), []);
});
