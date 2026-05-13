# src/api/collections.api.ts

## Что делает файл

Файл содержит клиентский API-слой для public/private коллекций и карточек.
После шага `5.6.1` он обслуживает не только read-only загрузку, но и реальные create/update мутации для коллекций.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` — DTO, query и response-типизация.
2. `src/firebase.ts` (`getIdToken`) — токен для private-запросов.

## Экспорты и контракты

1. `getPublicCollections(query?)`
2. `getOwnerCollections(query?)`
3. `createCollection(payload)`
4. `getPublicCollectionById(collectionId)`
5. `getCollectionById(collectionId)`
6. `updateCollection(collectionId, payload)`
7. `getPublicCollectionEntries(collectionId, query?)`
8. `getCollectionEntries(collectionId, query?)`
9. `EntriesQuery` поддерживает:
   - `page`, `limit`
   - `sortBy`, `sortOrder`
   - `status`
   - `tag`
   - `createdAtFrom`, `createdAtTo`
   - `dateStartFrom`, `dateStartTo`
   - `minPrice`, `maxPrice`
   - `minRating`, `maxRating`

## Нетривиальная логика

1. Общий `requestApi` распаковывает единый envelope `{ ok, data/error }` и одинаково обслуживает как read-only, так и mutation-запросы.
2. При сетевой недоступности local runtime модуль явно советует запустить `npm run dev:api`.
3. `createCollection` и `updateCollection` используют тот же auth-token flow, что и private list/detail endpoints, поэтому страницы не дублируют token-логику.
4. Public и private detail используют одинаковый helper, но с разными endpoint и auth-требованиями.
5. `toQueryString` пропускает пустые строки, поэтому неактивные фильтры не попадают в URL запроса.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx`
2. `src/pages/CollectionsPage/CollectionsPage.tsx`
3. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
4. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
