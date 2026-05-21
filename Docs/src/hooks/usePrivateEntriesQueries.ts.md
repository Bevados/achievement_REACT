# src/hooks/usePrivateEntriesQueries.ts

## Что делает файл

Хранит TanStack Query hooks и mutations для private списка карточек внутри коллекции.

## Импорты и зависимости

1. `@tanstack/react-query` даёт query и mutation primitives.
2. `src/api/collections.api.ts` даёт private entry API-операции.
3. `src/hooks/usePrivateCollectionsQueries.ts` даёт shared private query keys.
4. `src/hooks/query.types.ts` даёт тип `EntriesQuery`.

## Экспорты и контракты

1. `useCollectionEntriesQuery(collectionId, query)`
2. `useCreateEntryMutation()`
3. `useUpdateEntryMutation()`
4. `useDeleteEntryMutation()`

## Нетривиальная логика

1. Любая entry-мутация инвалидирует и entries-список, и detail коллекции, и owner collection list.
2. `useDeleteEntryMutation()` дополнительно сразу обновляет Query-кэш:
2.1. удаляет карточку из entries-списков этой коллекции;
2.2. уменьшает `entriesCount` в detail-кэше коллекции;
2.3. уменьшает `entriesCount` в owner collections list.
3. После локального обновления кэша сохраняется `invalidateQueries` как серверная синхронизация.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
