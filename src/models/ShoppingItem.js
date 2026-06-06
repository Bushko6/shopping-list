import { PurchaseStatus, isPurchaseStatus } from './PurchaseStatus.js';
import { normalizeName, normalizePositiveNumber, nowIso } from '../utils/validation.js';

export class ShoppingItem {
  constructor({
    id,
    name,
    quantity = 1,
    unit = 'pcs',
    category = 'general',
    priority = 3,
    price = 0,
    status = PurchaseStatus.PENDING,
    createdAt = nowIso(),
    purchasedAt = null,
  }) {
    if (!id) {
      throw new Error('Item id is required');
    }

    if (!isPurchaseStatus(status)) {
      throw new Error(`Unsupported purchase status: ${status}`);
    }

    this.id = id;
    this.name = normalizeName(name, 'Item name');
    this.quantity = normalizePositiveNumber(quantity, 'Quantity');
    this.unit = normalizeName(unit, 'Unit');
    this.category = normalizeName(category, 'Category').toLowerCase();
    this.priority = normalizePositiveNumber(priority, 'Priority');
    this.price = Number(price);
    this.status = status;
    this.createdAt = createdAt;
    this.purchasedAt = purchasedAt;
  }

  markPurchased(clock = nowIso) {
    if (this.status === PurchaseStatus.PURCHASED) {
      return this;
    }

    this.status = PurchaseStatus.PURCHASED;
    this.purchasedAt = clock();
    return this;
  }

  markPending() {
    this.status = PurchaseStatus.PENDING;
    this.purchasedAt = null;
    return this;
  }

  rename(name) {
    this.name = normalizeName(name, 'Item name');
    return this;
  }

  changeQuantity(quantity) {
    this.quantity = normalizePositiveNumber(quantity, 'Quantity');
    return this;
  }

  updatePrice(price) {
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      throw new Error('Price must be a non-negative number');
    }
    this.price = numericPrice;
    return this;
  }

  subtotal() {
    return Number((this.quantity * this.price).toFixed(2));
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      quantity: this.quantity,
      unit: this.unit,
      category: this.category,
      priority: this.priority,
      price: this.price,
      status: this.status,
      createdAt: this.createdAt,
      purchasedAt: this.purchasedAt,
    };
  }

  static fromJSON(data) {
    return new ShoppingItem(data);
  }
}
