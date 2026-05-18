# Learning Map

Короткий ориентир по проекту для быстрого входа.

## С чего начинать чтение

1. `README.md` — локальный запуск и release-check
2. `Plan.md` — статус этапов и принятые решения
3. `CHAT_CONTEXT_PROMPT.md` — актуальный handoff-контекст
4. `AI_RULES.md` — правила рабочего процесса

## Если хотите понять frontend

1. `src/App.tsx`
2. `src/pages/CollectionsPage/CollectionsPage.tsx`
3. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
4. `src/pages/ExamplesPage/ExamplesPage.tsx`
5. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`

## Если хотите понять backend

1. `api/collections/*`
2. `api/examples/collections/*`
3. `lib/controllers/collection.controller.ts`
4. `lib/services/collection.service.ts`
5. `lib/repositories/collection.repository.ts`
6. `contracts/collection.contracts.ts`
7. `contracts/collection.contracts.schema.ts`

## Если хотите понять data flow

1. `src/api/collections.api.ts`
2. `src/lib/query-client.ts`
3. `src/hooks/usePrivateCollectionsQueries.ts`
4. `src/hooks/usePrivateEntriesQueries.ts`
5. `src/hooks/usePublicCollectionsQueries.ts`
6. `src/hooks/useCollectionsListState.ts`
7. `src/hooks/useEntriesListState.ts`

## Что уже неактуально

- В проекте больше нет legacy `/api/items`.
- Старый `item.*` backend-stack удалён и не должен использоваться как ориентир.
