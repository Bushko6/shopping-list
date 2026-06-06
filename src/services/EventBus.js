export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    const listeners = this.listeners.get(eventName) ?? new Set();
    listeners.add(listener);
    this.listeners.set(eventName, listeners);

    return () => listeners.delete(listener);
  }

  publish(eventName, payload) {
    const listeners = this.listeners.get(eventName) ?? new Set();
    for (const listener of listeners) {
      listener(payload);
    }
  }
}
