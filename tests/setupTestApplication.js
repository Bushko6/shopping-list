import { EventBus } from '../src/services/EventBus.js';
import { ShoppingListService } from '../src/services/ShoppingListService.js';
import { InMemoryUnitOfWork } from '../src/storage/InMemoryUnitOfWork.js';

export function setupTestApplication() {
  const unitOfWork = new InMemoryUnitOfWork();
  const eventBus = new EventBus();
  const events = [];
  const capture = (eventName) => eventBus.subscribe(eventName, (payload) => events.push({ eventName, payload }));

  const service = new ShoppingListService({
    listRepository: unitOfWork.lists,
    itemRepository: unitOfWork.items,
    eventBus,
  });

  return { unitOfWork, eventBus, events, capture, service };
}
