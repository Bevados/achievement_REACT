# src/hooks/usePublicCollectionsQueries.ts

## Что делает файл

Собирает TanStack Query-слой для публичных examples: список коллекций, detail одной коллекции и read-only список карточек внутри неё.

## Импорты и зависимости

1. `@tanstack/react-query` — `useQuery` и тип результата query.
2. `contracts/collection.contracts.ts` — типы коллекций, карточек и пагинации.
3. `src/api/collections.api.ts` — реальные public API-запросы.
4. `useCollectionsListController.ts` и `useEntriesListController.ts` — типы query-параметров для cache keys.

## Экспорты и контракты

1. `publicCollectionKeys` — отдельный namespace query keys для:
   - списка public collections;
   - detail public collection;
   - entries внутри public detail.
2. `usePublicCollectionsQuery(query)` — загружает публичный список коллекций.
3. `usePublicCollectionDetailQuery(collectionId)` — загружает одну публичную коллекцию.
4. `usePublicCollectionEntriesQuery(collectionId, query)` — загружает read-only список карточек example-коллекции.

## Нетривиальная логика

1. Public query keys полностью отделены от private keys, чтобы examples не смешивались с приватным CRUD-кэшем.
2. Detail-query и entries-query отключаются, пока нет валидного `collectionId`.
3. Query hooks отвечают только за server-state; URL-state фильтров и пагинации остаётся в `useCollectionsListState()` и `useEntriesListState()`.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
