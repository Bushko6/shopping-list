import { ShoppingItem } from '../models/ShoppingItem.js';
import { PurchaseStatus } from '../models/PurchaseStatus.js';
import { ShoppingList } from '../models/ShoppingList.js';
import { SequentialIdGenerator } from '../utils/idGenerator.js';
import { ByPriorityStrategy, ShoppingSortContext } from './sortStrategies.js';

export const ShoppingEvents = Object.freeze({
  LIST_CREATED: 'list.created',
  ITEM_ADDED: 'item.added',
  ITEM_PURCHASED: 'item.purchased',
  ITEM_REMOVED: 'item.removed',
});

export class ShoppingListService {
  constructor({
    listRepository,
    itemRepository,
    eventBus,
    listIdGenerator = new SequentialIdGenerator('list'),
    itemIdGenerator = new SequentialIdGenerator('item'),
    sortContext = new ShoppingSortContext(new ByPriorityStrategy()),
  }) {
    this.listRepository = listRepository;
    this.itemRepository = itemRepository;
    this.eventBus = eventBus;
    this.listIdGenerator = listIdGenerator;
    this.itemIdGenerator = itemIdGenerator;
    this.sortContext = sortContext;
  }

  createList({ title, owner }) {
    const list = new ShoppingList({
      id: this.listIdGenerator.next(),
      title,
      owner,
    });
    const saved = this.listRepository.save(list);
    this.eventBus.publish(ShoppingEvents.LIST_CREATED, saved.toJSON());
    return saved;
  }

  addItem(listId, itemInput) {
    const list = this.requireList(listId);
    if (list.archived) {
      throw new Error('Cannot add items to archived list');
    }

    const item = new ShoppingItem({
      id: this.itemIdGenerator.next(),
      ...itemInput,
    });

    const savedItem = this.itemRepository.save(item);
    list.addItem(savedItem.id);
    this.listRepository.save(list);
    this.eventBus.publish(ShoppingEvents.ITEM_ADDED, { listId, item: savedItem.toJSON() });
    return savedItem;
  }

  markPurchased(listId, itemId, clock) {
    const list = this.requireList(listId);
    this.requireItemInList(list, itemId);
    const item = this.requireItem(itemId);
    item.markPurchased(clock);
    const saved = this.itemRepository.save(item);
    this.eventBus.publish(ShoppingEvents.ITEM_PURCHASED, { listId, item: saved.toJSON() });
    return saved;
  }

  markPending(listId, itemId) {
    const list = this.requireList(listId);
    this.requireItemInList(list, itemId);
    const item = this.requireItem(itemId);
    item.markPending();
    return this.itemRepository.save(item);
  }

  removeItem(listId, itemId) {
    const list = this.requireList(listId);
    this.requireItemInList(list, itemId);
    list.removeItem(itemId);
    this.listRepository.save(list);
    const deleted = this.itemRepository.delete(itemId);
    this.eventBus.publish(ShoppingEvents.ITEM_REMOVED, { listId, itemId });
    return deleted;
  }

  getListSummary(listId) {
    const list = this.requireList(listId);
    const items = list.itemIds.map((itemId) => this.requireItem(itemId));
    const purchasedCount = items.filter((item) => item.status === PurchaseStatus.PURCHASED).length;
    const total = items.reduce((sum, item) => sum + item.subtotal(), 0);
    const sortedItems = this.sortContext.sort(items);

    return {
      list: list.toJSON(),
      items: sortedItems.map((item) => item.toJSON()),
      total: Number(total.toFixed(2)),
      purchasedCount,
      pendingCount: items.length - purchasedCount,
      progress: items.length === 0 ? 0 : Number((purchasedCount / items.length).toFixed(2)),
    };
  }

  renameList(listId, title) {
    const list = this.requireList(listId);
    list.rename(title);
    return this.listRepository.save(list);
  }

  archiveList(listId) {
    const list = this.requireList(listId);
    list.archive();
    return this.listRepository.save(list);
  }

  requireList(listId) {
    const list = this.listRepository.findById(listId);
    if (!list) {
      throw new Error(`Shopping list not found: ${listId}`);
    }
    return list;
  }

  requireItem(itemId) {
    const item = this.itemRepository.findById(itemId);
    if (!item) {
      throw new Error(`Shopping item not found: ${itemId}`);
    }
    return item;
  }

  requireItemInList(list, itemId) {
    if (!list.itemIds.includes(itemId)) {
      throw new Error(`Item ${itemId} does not belong to list ${list.id}`);
    }
  }
}
