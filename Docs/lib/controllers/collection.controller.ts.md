# lib/controllers/collection.controller.ts

## Что делает файл

Controller связывает HTTP request/response с collection-service слоем.

## Импорты и зависимости

1. `lib/services/collection.service.ts` — бизнес-логика коллекций и карточек.
2. `contracts/collection.contracts.schema.ts` — валидация params/query/body.
3. `lib/http/api-response.ts` — helpers envelope-ответов.
4. `./controller-error` — единое преобразование ошибок в HTTP.

## Экспорты и контракты

1. Private handlers: `getCollections`, `createCollection`, `getCollection`, `updateCollection`, `deleteCollection`, `getEntries`, `createEntry`, `updateEntry`, `deleteEntry`.
2. Public handlers: `getPublicCollections`, `getPublicCollection`, `getPublicEntries`.

## Нетривиальная логика

1. Public detail handlers используют ту же param/query-нормализацию, что и private detail.
2. Controller хранит только HTTP-слой и не дублирует бизнес-правила из services.

## Где используется

1. `api/collections/*`
2. `api/examples/collections/*`
