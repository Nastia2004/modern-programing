import test from 'node:test';
import assert from 'node:assert/strict';
import { findById, findIndexById, paginate, sortItems, toPositiveInteger } from '../../src/utils/http.js';

test('toPositiveInteger returns fallback for invalid values', () => {
  assert.equal(toPositiveInteger('3', 1), 3);
  assert.equal(toPositiveInteger('-1', 5), 5);
  assert.equal(toPositiveInteger('abc', 7), 7);
});

test('find helpers locate items by numeric id', () => {
  const collection = [{ id: 1 }, { id: 2 }];

  assert.deepEqual(findById(collection, '2'), { id: 2 });
  assert.equal(findIndexById(collection, '1'), 0);
  assert.equal(findIndexById(collection, '9'), -1);
});

test('paginate returns data slice and metadata', () => {
  const result = paginate([1, 2, 3, 4], { page: '2', limit: '2' });

  assert.deepEqual(result.data, [3, 4]);
  assert.deepEqual(result.meta, {
    page: 2,
    limit: 2,
    total: 4,
    totalPages: 2
  });
});

test('sortItems sorts strings and numbers in both directions', () => {
  const items = [
    { id: 2, name: 'Beta' },
    { id: 1, name: 'Alpha' }
  ];

  assert.deepEqual(sortItems(items, 'name', 'asc').map((item) => item.name), ['Alpha', 'Beta']);
  assert.deepEqual(sortItems(items, 'id', 'desc').map((item) => item.id), [2, 1]);
});
