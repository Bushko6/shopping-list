import { ShoppingItem } from '../models/ShoppingItem.js';
import { PurchaseStatus } from '../models/PurchaseStatus.js';
import { InMemoryRepository } from './InMemoryRepository.js';

export class ShoppingItemRepository extends InMemoryRepository {
  constructor() {
    super((data) => ShoppingItem.fromJSON(data));
  }

  findPending() {
    return this.findAll().filter((item) => item.status === PurchaseStatus.PENDING);
  }

  findPurchased() {
    return this.findAll().filter((item) => item.status === PurchaseStatus.PURCHASED);
  }
}
