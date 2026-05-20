# api/examples/collections/[collectionId]/entries/index.ts

## Что делает файл

Поднимает public Vercel entrypoint для списка карточек внутри одной example-коллекции.

## Импорты и зависимости

1. `@vercel/node` — `VercelRequest` и `VercelResponse`.
2. `lib/controllers/collection.controller.js` — public entry-list handler.
3. `lib/http/api-response.js` — единый формат ошибок.

## Экспорты и контракты

1. Default export: `handler(req, res)`.
2. Route обслуживает public `/api/examples/collections/:collectionId/entries`.
3. Работает без auth и без private CRUD-операций.

## Нетривиальная логика

1. Public entries берутся только из example-данных и остаются read-only.
2. Relative imports переведены на `.js` для корректной Node ESM сборки Vercel serverless function.
3. Ошибки возвращаются в общем JSON envelope через `sendError`.

## Где используется

1. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`.
2. Public entries TanStack Query hook.
