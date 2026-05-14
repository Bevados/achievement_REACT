# src/pages/ExamplesPage/ExamplesPage.tsx

## Что делает файл

Рендерит public-список example-коллекций.

## Импорты и зависимости

1. `src/api/collections.api.ts`
2. `CollectionsGrid`
3. `CollectionsFilters`
4. `CollectionsPagination`
5. `useCollectionsListController`
6. `src/utils/routing.utils.ts`

## Экспорты и контракты

1. Экспортируется default-компонент `ExamplesPage`.

## Нетривиальная логика

1. Detail href строятся через `getPublicCollectionHref`, поэтому URL публичных коллекций читаемые и содержат `id + slug`.
2. Сама страница остаётся read-only и использует только public API.

## Где используется

1. `src/App.tsx`
