# src/hooks/usePrivateCollectionsQueries.ts

## Что делает файл

Хранит TanStack Query hooks и query-keys для private списка коллекций, detail и collection-scope invalidation.

## Импорты и зависимости

1. `@tanstack/react-query` даёт query и mutation primitives.
2. `src/api/collections.api.ts` даёт private API-операции.
3. `src/hooks/query.types.ts` даёт shared query shapes для списков коллекций и карточек.

## Экспорты и контракты

1. `privateCollectionKeys`
2. `useCollectionsQuery(query)`
3. `useCollectionDetailQuery(collectionId)`
4. `useCreateCollectionMutation()`
5. `useUpdateCollectionMutation()`
6. `useDeleteCollectionMutation()`

## Нетривиальная логика

1. Collection-scope invalidation обновляет и списки, и detail, и entries выбранной коллекции.
2. Query keys разделяют list/detail/entries namespace внутри private-потока.

## Где используется

1. `src/pages/CollectionsPage/CollectionsPage.tsx`
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
3. `src/hooks/usePrivateEntriesQueries.ts`
