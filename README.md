# Shopping List Architecture

[![CI Pipeline](https://github.com/SEGTSW/yev-asd/actions/workflows/ci-pipeline.yml/badge.svg)](https://github.com/SEGTSW/yev-asd/actions/workflows/ci-pipeline.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=SEGTSW_yev-asd&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=SEGTSW_yev-asd)

Node.js застосунок для створення та керування списками покупок. Проєкт побудований під вимоги курсу з архітектури: шари, GoF патерни, SOLID, in-memory persistence, 200+ тестів, звіти покриття, CI/CD і SonarQube.

## Функціонал

- Створення списків покупок.
- Додавання товарів з кількістю, одиницею, категорією, пріоритетом і ціною.
- Позначення товарів як придбаних або очікуваних.
- Видалення товарів.
- Архівація списків.
- Розрахунок суми, прогресу, кількості куплених і некуплених товарів.
- Події домену через Observer.
- Сортування через Strategy.

## Архітектура

- `src/models`: доменні моделі `ShoppingList`, `ShoppingItem`, `PurchaseStatus`.
- `src/services`: бізнес-сценарії, `ShoppingListService`, `EventBus`, стратегії сортування.
- `src/storage`: in-memory repositories і unit of work.
- `src/utils`: валідація та генерація ідентифікаторів.
- `tests`: модульні та інтеграційні тести.
- `docs/diagrams`: UML-діаграми у Mermaid.
- `.cursor/rules`: AI-контекст для Cursor/Claude/Copilot.

## Патерни

- Repository: ізоляція in-memory сховища від сервісного шару.
- Strategy: `ByPriorityStrategy`, `ByCategoryStrategy`, `ByStatusStrategy`.
- Observer: `EventBus` для подій `list.created`, `item.added`, `item.purchased`, `item.removed`.

## Команди

```bash
npm install
npm test
npm run lint
npm run build
```

Після `npm test` генеруються:

- `reports/junit.xml`
- `coverage/lcov.info`
- `coverage/cobertura-coverage.xml`
- `coverage/index.html`

## CI/CD

GitHub Actions pipeline виконує:

1. Встановлення залежностей.
2. Build check.
3. ESLint.
4. Тести та coverage reports.
5. SonarQube scan.
6. Завантаження `reports/` і `coverage/` як artifacts.

Для SonarCloud потрібно додати repository secret `SONAR_TOKEN` і налаштувати project key `SEGTSW_yev-asd`.

> У репозиторії налаштовано перевірку, яка не дозволить pipeline успішно пройти без `SONAR_TOKEN`. Це гарантує, що зелена галочка означатиме виконання Sonar скану.

## UML

- [Use Case Diagram](docs/diagrams/use-case.mmd)
- [Domain Model](docs/diagrams/domain-model.mmd)
- [Class Diagram](docs/diagrams/class-diagram.mmd)
