# api/collections/[collectionId]/entries/index.ts

## Что делает файл

Поднимает private Vercel entrypoint для списка карточек внутри коллекции и создания новой карточки.

## Импорты и зависимости

1. `@vercel/node` — тип `VercelResponse`.
2. `lib/controllers/collection.controller.js` — entry list/create handlers.
3. `lib/http/api-response.js` — единый ответ ошибок.
4. `lib/middleware/auth.js` — bearer auth gate.
5. `lib/types/request.types.js` — `AuthenticatedRequest`.

## Экспорты и контракты

1. Default export: `handler(req, res)`.
2. Route обслуживает private `/api/collections/:collectionId/entries`.
3. Создание и чтение карточек доступны только владельцу коллекции.

## Нетривиальная логика

1. Handler остаётся тонким и не знает о CRUD-деталях карточки.
2. Явные `.js` у относительных imports нужны для production ESM build на Vercel.
3. Все ошибки возвращаются в одном envelope через `sendError`.

## Где используется

1. Private collection detail page.
2. Create/list flow карточек через `EntryForm` и `EntriesGrid`.
