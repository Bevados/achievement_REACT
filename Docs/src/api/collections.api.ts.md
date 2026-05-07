# src/api/collections.api.ts

## Что делает файл

Файл содержит клиентский API-слой для загрузки public/private коллекций и их карточек.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` — DTO и response-типизация.
2. `src/firebase.ts` (`getIdToken`) — токен для private запросов.

## Экспорты и контракты

1. `getPublicCollections(query?)`
2. `getOwnerCollections(query?)`
3. `getPublicCollectionById(collectionId)`
4. `getCollectionById(collectionId)`
5. `getPublicCollectionEntries(collectionId, query?)`
6. `getCollectionEntries(collectionId, query?)`

## Нетривиальная логика

1. Общий `requestApi` распаковывает единый envelope `{ ok, data/error }`.
2. При сетевой недоступности local runtime модуль явно советует запустить `npm run dev:api`.
3. Public и private detail используют одинаковый клиентский helper, но с разными endpoint и auth-требованиями.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx`
2. `src/pages/CollectionsPage/CollectionsPage.tsx`
3. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
4. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
