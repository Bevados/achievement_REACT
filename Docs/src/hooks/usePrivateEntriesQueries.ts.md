# src/hooks/usePrivateEntriesQueries.ts

## Что делает файл

Содержит TanStack Query-слой для private-списка карточек коллекции и entry CRUD-мутаций.

## Импорты и зависимости

1. `@tanstack/react-query` — query/mutation primitives.
2. `src/api/collections.api.ts` — private entry endpoints.
3. `contracts/collection.contracts.ts` — типы карточек и DTO.
4. `usePrivateCollectionsQueries.ts` — общий namespace query keys.
5. `useEntriesListController.ts` — тип `EntriesQuery`.

## Экспорты и контракты

1. `useCollectionEntriesQuery(collectionId, query)` — server-state списка карточек внутри private detail.
2. `useCreateEntryMutation()` — create entry + invalidate списка коллекций, detail и entries текущей коллекции.
3. `useUpdateEntryMutation()` — update entry + та же инвалидaция.
4. `useDeleteEntryMutation()` — delete entry + та же инвалидaция.

## Нетривиальная логика

1. Инвалидируется не только `entries`, но и `lists` / `detail`, чтобы счётчики карточек и summary-блоки не расходились после мутаций.
2. Query списка карточек выключен, пока не появился валидный `collectionId`.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
