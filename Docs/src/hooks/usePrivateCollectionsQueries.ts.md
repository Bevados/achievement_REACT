# src/hooks/usePrivateCollectionsQueries.ts

## Что делает файл

Собирает TanStack Query-слой для private-коллекций: список, detail и collection CRUD-мутации.

## Импорты и зависимости

1. `@tanstack/react-query` — query/mutation hooks и доступ к `QueryClient`.
2. `src/api/collections.api.ts` — реальные private API-запросы.
3. `contracts/collection.contracts.ts` — типы коллекций и DTO.
4. `useCollectionsListController.ts` и `useEntriesListController.ts` — типы query-параметров для cache keys.

## Экспорты и контракты

1. `privateCollectionKeys` — namespace query keys для:
   - всех private collections;
   - списков;
   - detail;
   - entries внутри detail.
2. `useCollectionsQuery(query)` — загружает private-список коллекций.
3. `useCollectionDetailQuery(collectionId)` — загружает одну private-коллекцию.
4. `useCreateCollectionMutation()` — create + invalidate списка.
5. `useUpdateCollectionMutation()` — update + invalidate списка, detail и entries текущей коллекции.
6. `useDeleteCollectionMutation()` — delete + та же схема invalidate.

## Нетривиальная логика

1. `entries`-ключи вложены под detail-ключ коллекции, поэтому invalidate detail-scope автоматически захватывает дочерние server-state ветки.
2. После мутаций нет ручного reload: private UI обновляется через `invalidateQueries`.
3. Detail-query выключен, пока нет валидного `collectionId`.

## Где используется

1. `src/pages/CollectionsPage/CollectionsPage.tsx`
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
