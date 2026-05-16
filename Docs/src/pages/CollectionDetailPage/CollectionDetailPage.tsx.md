# src/pages/CollectionDetailPage/CollectionDetailPage.tsx

## Что делает файл

Рендерит private detail-страницу одной коллекции и её карточек.

## Импорты и зависимости

1. `src/hooks/usePrivateCollectionsQueries.ts` — detail и collection CRUD.
2. `src/hooks/usePrivateEntriesQueries.ts` — список карточек и entry CRUD.
3. `src/hooks/useEntriesListController.ts` — URL-state фильтров и пагинации.
4. `CollectionForm`, `EntryForm`, `EntriesGrid`, `EntriesFilters`, `EntriesPagination` — UI слоя detail.
5. `src/utils/routing.utils.ts` — readable href для возврата к спискам.

## Экспорты и контракты

1. Default export `CollectionDetailPage`.
2. Страница ожидает private detail route `/collections/:collectionId/:collectionSlug?`.
3. URL-state фильтров карточек остаётся в query string, а server-state приходит из TanStack Query.

## Нетривиальная логика

1. Detail и entries теперь берутся из TanStack Query, а не из ручных `useEffect`/`reload`.
2. После create/update/delete коллекции и карточек страница обновляется через invalidate query keys.
3. Верхний hero-блок меняет раскладку action-кнопок в зависимости от ширины экрана.

## Где используется

1. `src/App.tsx`
