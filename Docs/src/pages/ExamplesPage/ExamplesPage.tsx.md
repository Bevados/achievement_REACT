# src/pages/ExamplesPage/ExamplesPage.tsx

## Что делает файл

Рендерит public-список example-коллекций.

## Импорты и зависимости

1. `CollectionsGrid` — сетка карточек коллекций.
2. `CollectionsFilters` — фильтры и сортировка списка.
3. `CollectionsPagination` — пагинация.
4. `useCollectionsListController` — URL-state для страницы examples.
5. `usePublicCollectionsQueries` — TanStack Query-загрузка публичного списка.
6. `src/utils/routing.utils.ts` — сборка public href в формате `id + slug`.

## Экспорты и контракты

1. Экспортируется default-компонент `ExamplesPage`.

## Нетривиальная логика

1. Страница использует `useCollectionsListState()` только как слой URL-state, а реальные данные загружает через `usePublicCollectionsQuery()`.
2. Retry-кнопка больше не вызывает ручной reload, а использует `collectionsQuery.refetch()`.
3. Detail href строятся через `getPublicCollectionHref`, поэтому URL публичных коллекций читаемые и содержат `id + slug`.
4. Страница остаётся read-only и использует только public Query/API.

## Где используется

1. `src/App.tsx`
