import { EventBus } from './services/EventBus.js';
import { ShoppingEvents, ShoppingListService } from './services/ShoppingListService.js';
import { InMemoryUnitOfWork } from './storage/InMemoryUnitOfWork.js';

export function createShoppingApplication() {
  const unitOfWork = new InMemoryUnitOfWork();
  const eventBus = new EventBus();
  const service = new ShoppingListService({
    listRepository: unitOfWork.lists,
    itemRepository: unitOfWork.items,
    eventBus,
  });

  return { service, unitOfWork, eventBus };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { service, eventBus } = createShoppingApplication();
  eventBus.subscribe(ShoppingEvents.ITEM_PURCHASED, ({ item }) => {
    console.log(`Purchased: ${item.name}`);
  });

  const weekend = service.createList({ title: 'Weekend groceries', owner: 'student' });
  const milk = service.addItem(weekend.id, { name: 'Milk', quantity: 2, unit: 'bottle', price: 1.5 });
  service.addItem(weekend.id, { name: 'Bread', quantity: 1, unit: 'loaf', price: 1.2, priority: 1 });
  service.markPurchased(weekend.id, milk.id);
  console.log(JSON.stringify(service.getListSummary(weekend.id), null, 2));
}
