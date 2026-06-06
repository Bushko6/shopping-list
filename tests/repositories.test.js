import { describe, expect, it } from 'vitest';
import { ShoppingItem } from '../src/models/ShoppingItem.js';
import { PurchaseStatus } from '../src/models/PurchaseStatus.js';
import { ShoppingList } from '../src/models/ShoppingList.js';
import { ShoppingItemRepository } from '../src/storage/ShoppingItemRepository.js';
import { ShoppingListRepository } from '../src/storage/ShoppingListRepository.js';
import { InMemoryUnitOfWork } from '../src/storage/InMemoryUnitOfWork.js';

describe('In-memory repositories', () => {
  Array.from({ length: 45 }, (_, index) => index + 1).forEach((number) => {
    it(`stores defensive item copy ${number}`, () => {
      const repository = new ShoppingItemRepository();
      const item = repository.save(new ShoppingItem({ id: `item-${number}`, name: `Item ${number}` }));
      item.rename('Changed outside');
      expect(repository.findById(`item-${number}`).name).toBe(`Item ${number}`);
    });
  });

  it('filters purchased and pending items', () => {
    const repository = new ShoppingItemRepository();
    repository.save(new ShoppingItem({ id: 'purchased', name: 'Coffee', status: PurchaseStatus.PURCHASED }));
    repository.save(new ShoppingItem({ id: 'pending', name: 'Sugar' }));
    expect(repository.findPurchased()).toHaveLength(1);
    expect(repository.findPending()).toHaveLength(1);
  });

  it('filters active lists and lists by owner', () => {
    const repository = new ShoppingListRepository();
    repository.save(new ShoppingList({ id: 'list-1', title: 'First', owner: 'olena' }));
    repository.save(new ShoppingList({ id: 'list-2', title: 'Second', owner: 'olena', archived: true }));
    repository.save(new ShoppingList({ id: 'list-3', title: 'Third', owner: 'ivan' }));
    expect(repository.findActive()).toHaveLength(2);
    expect(repository.findByOwner('olena')).toHaveLength(2);
  });

  it('returns false when deleting missing record', () => {
    const repository = new ShoppingItemRepository();
    expect(repository.delete('missing')).toBe(false);
  });

  it('restores full unit of work snapshot', () => {
    const unitOfWork = new InMemoryUnitOfWork();
    unitOfWork.lists.save(new ShoppingList({ id: 'list-1', title: 'Groceries', itemIds: ['item-1'] }));
    unitOfWork.items.save(new ShoppingItem({ id: 'item-1', name: 'Water' }));
    const snapshot = unitOfWork.snapshot();
    unitOfWork.lists.clear();
    unitOfWork.items.clear();
    unitOfWork.restore(snapshot);
    expect(unitOfWork.lists.findById('list-1').itemIds).toEqual(['item-1']);
    expect(unitOfWork.items.findById('item-1').name).toBe('Water');
  });
});
