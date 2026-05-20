# src/hooks/usePublicCollectionsQueries.ts

## Что делает файл

Хранит read-only TanStack Query hooks и query-keys для public examples.

## Импорты и зависимости

1. `@tanstack/react-query` даёт query primitives.
2. `src/api/collections.api.ts` даёт public example API-операции.
3. `src/hooks/query.types.ts` даёт shared query shapes для списков коллекций и карточек.

## Экспорты и контракты

1. `publicCollectionKeys`
2. `usePublicCollectionsQuery(query)`
3. `usePublicCollectionDetailQuery(collectionId)`
4. `usePublicCollectionEntriesQuery(collectionId, query)`

## Нетривиальная логика

1. Public query keys полностью отделены от private namespace.
2. Все hooks остаются read-only и не содержат мутаций.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
