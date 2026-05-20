# api/collections/[collectionId]/entries/[entryId]/index.ts

## Что делает файл

Поднимает private Vercel entrypoint для операций над одной карточкой: чтение, редактирование и удаление.

## Импорты и зависимости

1. `@vercel/node` — тип `VercelResponse`.
2. `lib/controllers/collection.controller.js` — detail handlers карточки.
3. `lib/http/api-response.js` — единый формат ошибок.
4. `lib/middleware/auth.js` — auth gate.
5. `lib/types/request.types.js` — `AuthenticatedRequest`.

## Экспорты и контракты

1. Default export: `handler(req, res)`.
2. Route обслуживает private `/api/collections/:collectionId/entries/:entryId`.
3. Любое действие над карточкой разрешено только владельцу родительской коллекции.

## Нетривиальная логика

1. Handler сознательно не хранит бизнес-логику и только склеивает auth + controller.
2. Relative imports переведены на `.js`, чтобы Vercel Node ESM builder не падал на production deploy.
3. Ошибки приводятся к общему JSON envelope через `sendError`.

## Где используется

1. Private collection detail page.
2. Update/delete flow карточек через `EntryForm` и inline actions в `EntryCard`.
