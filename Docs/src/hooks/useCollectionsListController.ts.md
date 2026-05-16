# src/hooks/useCollectionsListController.ts

## Что делает файл

Хранит общий controller-хук и отдельный state-хук для списков коллекций.

## Импорты и зависимости

1. `react` — reducer, эффекты и legacy manual-fetch state.
2. `react-router-dom` — `useSearchParams`.
3. `contracts/collection.contracts.ts` — типы коллекций, категорий и сортировок.

## Экспорты и контракты

1. `CollectionsQuery` — нормализованный shape query-параметров списка коллекций.
2. `useCollectionsListState()` — URL-state для фильтров, сортировки, поиска и пагинации без загрузки данных.
3. `useCollectionsListController(options)` — legacy/manual-fetch обёртка над `useCollectionsListState()` для совместимости со старыми сценариями.

## Нетривиальная логика

1. URL-state синхронизируется через reducer, а не через пачку `setState` в эффекте.
2. Sync обратно в URL идёт без `replace`, чтобы back/forward в браузере ощущались естественно.
3. При смене фильтров и сортировки страница сбрасывается на `1`.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx` — через `useCollectionsListState()`.
2. `src/pages/CollectionsPage/CollectionsPage.tsx` — через `useCollectionsListState()` и private Query hooks.
3. Тип `CollectionsQuery` используется в private и public query keys.
