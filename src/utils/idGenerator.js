export class SequentialIdGenerator {
  constructor(prefix) {
    this.prefix = prefix;
    this.nextValue = 1;
  }

  next() {
    const id = `${this.prefix}-${String(this.nextValue).padStart(4, '0')}`;
    this.nextValue += 1;
    return id;
  }
}
