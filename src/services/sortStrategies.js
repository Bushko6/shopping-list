export class ByPriorityStrategy {
  sort(items) {
    return [...items].sort((left, right) => left.priority - right.priority || left.name.localeCompare(right.name));
  }
}

export class ByCategoryStrategy {
  sort(items) {
    return [...items].sort((left, right) => left.category.localeCompare(right.category) || left.name.localeCompare(right.name));
  }
}

export class ByStatusStrategy {
  sort(items) {
    return [...items].sort((left, right) => left.status.localeCompare(right.status) || left.name.localeCompare(right.name));
  }
}

export class ShoppingSortContext {
  constructor(strategy = new ByPriorityStrategy()) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    if (typeof strategy?.sort !== 'function') {
      throw new Error('Sort strategy must implement sort(items)');
    }
    this.strategy = strategy;
  }

  sort(items) {
    return this.strategy.sort(items);
  }
}
