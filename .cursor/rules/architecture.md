# Architecture Rules

The application is a layered Node.js project for shopping list management.

- `src/models`: domain entities and domain validation.
- `src/services`: application use cases, orchestration, Strategy and Observer patterns.
- `src/storage`: in-memory repositories and unit-of-work snapshots.
- `src/utils`: cross-cutting helpers without business decisions.

Dependency direction:

- Services depend on repository contracts by behavior: `save`, `findById`, `findAll`, `delete`.
- Models do not import services or storage.
- Storage creates defensive copies to simulate persistence boundaries.
- No external database, REST API, file persistence, or network dependency is allowed.

Patterns:

- Repository Pattern: `ShoppingListRepository`, `ShoppingItemRepository`.
- Strategy: `ShoppingSortContext` accepts interchangeable sorting strategies.
- Observer: `EventBus` publishes domain events to subscribers.

SOLID expectations:

- Single Responsibility: model objects validate and mutate themselves; services coordinate use cases.
- Open/Closed: add new sort strategies by implementing `sort(items)`.
- Dependency Inversion: inject repositories and event bus into services.
