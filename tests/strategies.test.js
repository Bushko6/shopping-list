import { describe, expect, it } from 'vitest';
import { ShoppingItem } from '../src/models/ShoppingItem.js';
import { PurchaseStatus } from '../src/models/PurchaseStatus.js';
import { ByCategoryStrategy, ByPriorityStrategy, ByStatusStrategy, ShoppingSortContext } from '../src/services/sortStrategies.js';

function makeItems() {
  return [
    new ShoppingItem({ id: 'a', name: 'Banana', category: 'fruit', priority: 3 }),
    new ShoppingItem({ id: 'b', name: 'Soap', category: 'home', priority: 1 }),
    new ShoppingItem({ id: 'c', name: 'Apple', category: 'fruit', priority: 1, status: PurchaseStatus.PURCHASED }),
  ];
}

describe('Sort strategies', () => {
  Array.from({ length: 25 }, (_, index) => index + 1).forEach((number) => {
    it(`sorts by priority generated case ${number}`, () => {
      const context = new ShoppingSortContext(new ByPriorityStrategy());
      expect(context.sort(makeItems()).map((item) => item.id)).toEqual(['c', 'b', 'a']);
    });
  });

  Array.from({ length: 25 }, (_, index) => index + 1).forEach((number) => {
    it(`sorts by category generated case ${number}`, () => {
      const context = new ShoppingSortContext(new ByCategoryStrategy());
      expect(context.sort(makeItems()).map((item) => item.id)).toEqual(['c', 'a', 'b']);
    });
  });

  it('sorts by status', () => {
    const context = new ShoppingSortContext(new ByStatusStrategy());
    expect(context.sort(makeItems()).map((item) => item.id)).toEqual(['a', 'b', 'c']);
  });

  it('rejects invalid strategy', () => {
    const context = new ShoppingSortContext();
    expect(() => context.setStrategy({})).toThrow('Sort strategy must implement');
  });
});
