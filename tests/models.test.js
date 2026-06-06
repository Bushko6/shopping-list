import { describe, expect, it } from 'vitest';
import { PurchaseStatus } from '../src/models/PurchaseStatus.js';
import { ShoppingItem } from '../src/models/ShoppingItem.js';
import { ShoppingList } from '../src/models/ShoppingList.js';

describe('ShoppingItem model', () => {
  const invalidNames = ['', '   ', 10, null, 'x'.repeat(121)];

  invalidNames.forEach((name, index) => {
    it(`rejects invalid item name case ${index + 1}`, () => {
      expect(() => new ShoppingItem({ id: `item-${index}`, name })).toThrow();
    });
  });

  [0, -1, Number.NaN, Number.POSITIVE_INFINITY, 'abc'].forEach((quantity, index) => {
    it(`rejects invalid quantity case ${index + 1}`, () => {
      expect(() => new ShoppingItem({ id: `item-q-${index}`, name: 'Milk', quantity })).toThrow();
    });
  });

  Array.from({ length: 60 }, (_, index) => index + 1).forEach((quantity) => {
    it(`calculates subtotal for generated quantity ${quantity}`, () => {
      const item = new ShoppingItem({ id: `item-sub-${quantity}`, name: 'Apples', quantity, price: 1.25 });
      expect(item.subtotal()).toBe(Number((quantity * 1.25).toFixed(2)));
    });
  });

  it('normalizes text fields', () => {
    const item = new ShoppingItem({ id: 'item-normalized', name: '  Fresh   Milk ', unit: ' bottle ', category: ' Dairy ' });
    expect(item.name).toBe('Fresh Milk');
    expect(item.unit).toBe('bottle');
    expect(item.category).toBe('dairy');
  });

  it('marks item as purchased only once', () => {
    const item = new ShoppingItem({ id: 'item-purchased', name: 'Bread' });
    item.markPurchased(() => '2026-06-01T10:00:00.000Z');
    item.markPurchased(() => '2026-06-02T10:00:00.000Z');
    expect(item.status).toBe(PurchaseStatus.PURCHASED);
    expect(item.purchasedAt).toBe('2026-06-01T10:00:00.000Z');
  });

  it('can return purchased item to pending state', () => {
    const item = new ShoppingItem({ id: 'item-pending', name: 'Rice' });
    item.markPurchased(() => '2026-06-01T10:00:00.000Z').markPending();
    expect(item.status).toBe(PurchaseStatus.PENDING);
    expect(item.purchasedAt).toBeNull();
  });

  it('rejects unsupported status', () => {
    expect(() => new ShoppingItem({ id: 'item-bad-status', name: 'Tea', status: 'lost' })).toThrow();
  });

  it('rejects negative prices', () => {
    const item = new ShoppingItem({ id: 'item-price', name: 'Tea' });
    expect(() => item.updatePrice(-1)).toThrow();
  });
});

describe('ShoppingList model', () => {
  it('deduplicates item ids', () => {
    const list = new ShoppingList({ id: 'list-1', title: 'Market', itemIds: ['a', 'a', 'b'] });
    expect(list.itemIds).toEqual(['a', 'b']);
  });

  it('renames and archives list', () => {
    const list = new ShoppingList({ id: 'list-2', title: 'Market' });
    list.rename('Local shop').archive().restore();
    expect(list.title).toBe('Local shop');
    expect(list.archived).toBe(false);
  });

  Array.from({ length: 35 }, (_, index) => `item-${index}`).forEach((itemId) => {
    it(`adds and removes generated item id ${itemId}`, () => {
      const list = new ShoppingList({ id: `list-${itemId}`, title: 'Generated' });
      list.addItem(itemId).addItem(itemId).removeItem(itemId);
      expect(list.itemIds).toEqual([]);
    });
  });
});
