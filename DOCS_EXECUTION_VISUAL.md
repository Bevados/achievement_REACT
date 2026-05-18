# Execution Visual

Короткая визуальная карта актуального исполнения проекта.

## Public flow

`/examples`

1. `src/pages/ExamplesPage/ExamplesPage.tsx`
2. `src/hooks/useCollectionsListState.ts`
3. `src/hooks/usePublicCollectionsQueries.ts`
4. `src/api/collections.api.ts -> GET /api/examples/collections`
5. `api/examples/collections/index.ts`
6. `lib/controllers/collection.controller.ts`
7. `lib/services/collection.service.ts`
8. `lib/repositories/collection.repository.ts`

`/examples/:collectionId/:collectionSlug?`

1. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
2. `src/hooks/useEntriesListState.ts`
3. `src/hooks/usePublicCollectionsQueries.ts`
4. `src/api/collections.api.ts`
5. `/api/examples/collections/:collectionId`
6. `/api/examples/collections/:collectionId/entries`

## Private flow

`/collections`

1. `src/pages/CollectionsPage/CollectionsPage.tsx`
2. `src/hooks/useCollectionsListState.ts`
3. `src/hooks/usePrivateCollectionsQueries.ts`
4. `src/api/collections.api.ts -> GET /api/collections`
5. `api/collections/index.ts`

`/collections/:collectionId/:collectionSlug?`

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
2. `src/hooks/useEntriesListState.ts`
3. `src/hooks/usePrivateCollectionsQueries.ts`
4. `src/hooks/usePrivateEntriesQueries.ts`
5. `src/api/collections.api.ts`
6. `/api/collections/:collectionId`
7. `/api/collections/:collectionId/entries`
8. `/api/collections/:collectionId/entries/:entryId`

## Auth gate

1. Frontend получает ID token через `src/firebase.ts`
2. Private API-запросы добавляют `Authorization: Bearer <token>`
3. `lib/middleware/auth.ts` проверяет токен через `api/_firebaseAdmin.ts`
4. После этого `req.userId` используется в collection-controller/service flow
