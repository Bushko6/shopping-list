import { normalizeName, nowIso } from '../utils/validation.js';

export class ShoppingList {
  constructor({ id, title, owner = 'anonymous', createdAt = nowIso(), archived = false, itemIds = [] }) {
    if (!id) {
      throw new Error('List id is required');
    }

    this.id = id;
    this.title = normalizeName(title, 'List title');
    this.owner = normalizeName(owner, 'Owner');
    this.createdAt = createdAt;
    this.archived = Boolean(archived);
    this.itemIds = [...new Set(itemIds)];
  }

  rename(title) {
    this.title = normalizeName(title, 'List title');
    return this;
  }

  addItem(itemId) {
    if (!itemId) {
      throw new Error('Item id is required');
    }

    if (!this.itemIds.includes(itemId)) {
      this.itemIds.push(itemId);
    }
    return this;
  }

  removeItem(itemId) {
    this.itemIds = this.itemIds.filter((id) => id !== itemId);
    return this;
  }

  archive() {
    this.archived = true;
    return this;
  }

  restore() {
    this.archived = false;
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      owner: this.owner,
      createdAt: this.createdAt,
      archived: this.archived,
      itemIds: [...this.itemIds],
    };
  }

  static fromJSON(data) {
    return new ShoppingList(data);
  }
}
