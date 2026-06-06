# Requirements and Simulation

## Problem

The system manages shopping lists without external persistence. It solves these logic problems:

- Creating multiple named shopping lists for different owners.
- Adding normalized shopping items with quantity, unit, category, priority, and price.
- Marking items as purchased or pending.
- Calculating totals, pending count, purchased count, and progress.
- Preventing modification of archived lists.
- Keeping data isolated through repository snapshots.
- Notifying subscribers when important domain events happen.

## Actors

- Customer: creates and manages shopping lists.
- Store helper: reviews list progress and marks purchased items.
- QA/Developer: runs tests, checks reports, and monitors quality gate.

## Use Cases

1. Create shopping list.
2. Rename shopping list.
3. Add item to active list.
4. Mark item as purchased.
5. Return item to pending state.
6. Remove item from list.
7. Archive list to block future additions.

## Business Rules

- Empty names are rejected.
- Quantity and priority must be positive numbers.
- Price must be a non-negative number.
- An item can be purchased only if it belongs to the target list.
- Archived lists cannot accept new items.
- Summary progress equals purchased items divided by total items.
