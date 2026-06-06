export class InMemoryRepository {
  constructor(entityFactory) {
    this.entityFactory = entityFactory;
    this.records = new Map();
  }

  save(entity) {
    if (!entity?.id) {
      throw new Error('Entity id is required');
    }

    this.records.set(entity.id, this.entityFactory(entity.toJSON()));
    return this.findById(entity.id);
  }

  findById(id) {
    const entity = this.records.get(id);
    return entity ? this.entityFactory(entity.toJSON()) : null;
  }

  findAll() {
    return Array.from(this.records.values(), (entity) => this.entityFactory(entity.toJSON()));
  }

  delete(id) {
    return this.records.delete(id);
  }

  clear() {
    this.records.clear();
  }

  snapshot() {
    return this.findAll().map((entity) => entity.toJSON());
  }

  restore(snapshot) {
    this.records.clear();
    for (const entityData of snapshot) {
      const entity = this.entityFactory(entityData);
      this.records.set(entity.id, entity);
    }
  }
}
