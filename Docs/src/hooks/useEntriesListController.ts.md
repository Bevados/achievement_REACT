# src/hooks/useEntriesListController.ts

## Что делает файл

Хранит только URL-state для списка карточек внутри коллекции.
Хук управляет фильтрами, сортировкой и пагинацией, а реальные данные загружаются уже через TanStack Query.

## Импорты и зависимости

1. `react` используется для reducer и синхронизации состояния.
2. `react-router-dom` даёт `useSearchParams`.
3. `contracts/collection.contracts.ts` даёт статусы и сортировки карточек.
4. `src/hooks/query.types.ts` даёт тип `EntriesQuery`.

## Экспорты и контракты

1. `useEntriesListState(pageSize?)` — состояние и действия для filters/pagination блока карточек.

## Нетривиальная логика

1. Даты фильтров конвертируются в ISO-границы суток только при сборке `query`.
2. `hasActiveFilters` вычисляется по применённым, а не просто введённым значениям.
3. `resetFilters()` очищает и input-state, и applied-state.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
3. Private/public entry Query hooks используют общий тип из `src/hooks/query.types.ts`.
