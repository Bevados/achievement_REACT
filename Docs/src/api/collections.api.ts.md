# src/api/collections.api.ts

## Что делает файл

Клиентский API-слой для публичных и приватных коллекций и карточек.
Файл инкапсулирует HTTP-вызовы, auth-token для private endpoints, разбор общего response envelope и fallback-ошибки для локальной разработки.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` — DTO, query-типы и response-типы.
2. `src/firebase.ts` — `getIdToken()` для приватных запросов.

## Экспорты и контракты

1. Public collection API:
   - `getPublicCollections(query?)`
   - `getPublicCollectionById(collectionId)`
   - `getPublicCollectionEntries(collectionId, query?)`
2. Private collection API:
   - `getOwnerCollections(query?)`
   - `createCollection(payload)`
   - `getCollectionById(collectionId)`
   - `updateCollection(collectionId, payload)`
   - `deleteCollection(collectionId)`
3. Private entry API:
   - `getCollectionEntries(collectionId, query?)`
   - `createEntry(collectionId, payload)`
   - `updateEntry(collectionId, entryId, payload)`
   - `deleteEntry(collectionId, entryId)`
4. `EntriesQuery` поддерживает сортировку, пагинацию и диапазонные фильтры карточек.

## Нетривиальная логика

1. `requestApi()` одинаково обслуживает read и mutation-запросы, включая валидные delete-ответы вида `ok: true` + `data: null`.
2. Private methods автоматически добавляют `Authorization: Bearer <token>`.
3. При сетевой недоступности локального backend файл подсказывает запустить `npm run dev:api`.
4. `toQueryString()` не отправляет пустые строки, поэтому неактивные фильтры не засоряют URL.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
3. `src/pages/CollectionsPage/CollectionsPage.tsx`
4. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
