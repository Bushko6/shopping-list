import { ShoppingItemRepository } from './ShoppingItemRepository.js';
import { ShoppingListRepository } from './ShoppingListRepository.js';

export class InMemoryUnitOfWork {
  constructor() {
    this.lists = new ShoppingListRepository();
    this.items = new ShoppingItemRepository();
  }

  snapshot() {
    return {
      lists: this.lists.snapshot(),
      items: this.items.snapshot(),
    };
  }

  restore(snapshot) {
    this.lists.restore(snapshot.lists ?? []);
    this.items.restore(snapshot.items ?? []);
  }
}
