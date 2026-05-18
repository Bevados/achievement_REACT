# File Map

Актуальная карта проекта `achievement_collections_REACT`.

## Основные слои

- `src/` — frontend на React + TypeScript
- `api/` — Vercel-style API entrypoints
- `lib/` — backend-логика: controllers / services / repositories / middleware
- `contracts/` — shared DTO и runtime-схемы
- `Docs/` — зеркальная документация по исходникам
- `scripts/` — служебные скрипты, seed, docs, локальный backend-runner

## Ключевые frontend entrypoints

- `src/App.tsx` — маршрутизация public/private flow
- `src/pages/ExamplesPage/ExamplesPage.tsx` — public список examples
- `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx` — public detail examples
- `src/pages/CollectionsPage/CollectionsPage.tsx` — private список коллекций
- `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` — private detail коллекции и entries CRUD
- `src/api/collections.api.ts` — клиентский API-слой для public/private routes

## Ключевые backend entrypoints

- `api/collections/index.ts`
- `api/collections/[collectionId]/index.ts`
- `api/collections/[collectionId]/entries/index.ts`
- `api/collections/[collectionId]/entries/[entryId]/index.ts`
- `api/examples/collections/index.ts`
- `api/examples/collections/[collectionId]/index.ts`
- `api/examples/collections/[collectionId]/entries/index.ts`

## Ключевая backend-цепочка

`api/* -> lib/controllers/collection.controller.ts -> lib/services/collection.service.ts -> lib/repositories/collection.repository.ts -> MongoDB`

## Data layer

- `src/lib/query-client.ts` — QueryClient
- `src/hooks/usePrivateCollectionsQueries.ts` — private Query/mutation hooks
- `src/hooks/usePrivateEntriesQueries.ts` — private entries Query/mutation hooks
- `src/hooks/usePublicCollectionsQueries.ts` — public read-only Query hooks
- `src/hooks/useCollectionsListState.ts` и `src/hooks/useEntriesListState.ts` — URL/filter state

## Что важно

- Актуальная runtime-поверхность ограничена `collections` и `examples`.
- Legacy `/api/items` и старый `item.*` stack удалены из проекта.
