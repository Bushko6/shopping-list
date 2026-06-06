import { describe, expect, it, vi } from 'vitest';
import { ShoppingEvents } from '../src/services/ShoppingListService.js';
import { setupTestApplication } from './setupTestApplication.js';

describe('ShoppingListService business logic', () => {
  Array.from({ length: 80 }, (_, index) => index + 1).forEach((number) => {
    it(`creates list, adds generated item, and calculates summary ${number}`, () => {
      const { service } = setupTestApplication();
      const list = service.createList({ title: `Weekly list ${number}`, owner: 'student' });
      service.addItem(list.id, { name: `Product ${number}`, quantity: number, price: 0.5, priority: 2 });
      const summary = service.getListSummary(list.id);
      expect(summary.total).toBe(Number((number * 0.5).toFixed(2)));
      expect(summary.pendingCount).toBe(1);
      expect(summary.progress).toBe(0);
    });
  });

  Array.from({ length: 35 }, (_, index) => index + 1).forEach((number) => {
    it(`marks generated item as purchased ${number}`, () => {
      const { service } = setupTestApplication();
      const list = service.createList({ title: `List ${number}`, owner: 'qa' });
      const item = service.addItem(list.id, { name: `Product ${number}` });
      service.markPurchased(list.id, item.id, () => '2026-06-06T10:00:00.000Z');
      const summary = service.getListSummary(list.id);
      expect(summary.purchasedCount).toBe(1);
      expect(summary.progress).toBe(1);
      expect(summary.items[0].purchasedAt).toBe('2026-06-06T10:00:00.000Z');
    });
  });

  it('publishes list and item domain events', () => {
    const { service, capture, events } = setupTestApplication();
    const unsubscribeList = capture(ShoppingEvents.LIST_CREATED);
    const unsubscribeAdded = capture(ShoppingEvents.ITEM_ADDED);
    const unsubscribePurchased = capture(ShoppingEvents.ITEM_PURCHASED);
    const list = service.createList({ title: 'Events', owner: 'qa' });
    const item = service.addItem(list.id, { name: 'Cheese' });
    service.markPurchased(list.id, item.id, () => '2026-06-06T10:00:00.000Z');
    unsubscribeList();
    unsubscribeAdded();
    unsubscribePurchased();
    expect(events.map((event) => event.eventName)).toEqual([
      ShoppingEvents.LIST_CREATED,
      ShoppingEvents.ITEM_ADDED,
      ShoppingEvents.ITEM_PURCHASED,
    ]);
  });

  it('removes item from list and repository', () => {
    const { service, unitOfWork } = setupTestApplication();
    const list = service.createList({ title: 'Remove', owner: 'qa' });
    const item = service.addItem(list.id, { name: 'Old item' });
    expect(service.removeItem(list.id, item.id)).toBe(true);
    expect(unitOfWork.items.findById(item.id)).toBeNull();
    expect(service.getListSummary(list.id).items).toEqual([]);
  });

  it('rejects item additions to archived list', () => {
    const { service } = setupTestApplication();
    const list = service.createList({ title: 'Archive', owner: 'qa' });
    service.archiveList(list.id);
    expect(() => service.addItem(list.id, { name: 'Blocked' })).toThrow('Cannot add items to archived list');
  });

  it('rejects operations for missing list and missing item ownership', () => {
    const { service } = setupTestApplication();
    const first = service.createList({ title: 'First', owner: 'qa' });
    const second = service.createList({ title: 'Second', owner: 'qa' });
    const item = service.addItem(first.id, { name: 'Scoped item' });
    expect(() => service.getListSummary('missing')).toThrow('Shopping list not found');
    expect(() => service.markPurchased(second.id, item.id)).toThrow('does not belong');
  });

  it('can mock event subscriber in service layer', () => {
    const { service, eventBus } = setupTestApplication();
    const listener = vi.fn();
    eventBus.subscribe(ShoppingEvents.ITEM_REMOVED, listener);
    const list = service.createList({ title: 'Mocked', owner: 'qa' });
    const item = service.addItem(list.id, { name: 'Mock me' });
    service.removeItem(list.id, item.id);
    expect(listener).toHaveBeenCalledWith({ listId: list.id, itemId: item.id });
  });
});
