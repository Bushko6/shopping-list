import { ShoppingList } from '../models/ShoppingList.js';
import { InMemoryRepository } from './InMemoryRepository.js';

export class ShoppingListRepository extends InMemoryRepository {
  constructor() {
    super((data) => ShoppingList.fromJSON(data));
  }

  findActive() {
    return this.findAll().filter((list) => !list.archived);
  }

  findByOwner(owner) {
    return this.findAll().filter((list) => list.owner === owner);
  }
}
